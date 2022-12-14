import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { loadFromLocalStorage, storeOnLocalStorage } from './utils/localStorage.js';
import storeOnServer from './api/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import { getInitialState, getUser, isLoading, setGlobalState } from './state/index.js';
import style from './App.module.css';

const routes = [
  { path: '/', component: Members },
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  { path: '/newgroup', component: NewGroup },
  { path: '/records', component: Records },
  { path: '*', component: NotFound },
];

createRoutes(routes);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.init();
  }

  async init() {
    let initialState = getInitialState();

    try {
      const { data: response } = await axios.get('/auth');

      // 토큰이 있고 유효하면(로그인 성공) 받아온 정보 갱신
      if (response.success) {
        const { user, userId, organization } = response;
        initialState = { ...initialState, user, userId, organization };
      }

      // 토큰이 없거나 유효하지 않으면(로그인 실패)
      else {
        // 로컬스토리지 확인
        const localOrganization = loadFromLocalStorage();
        // 로컬스토리지에 정보가 있으면 받아온 정보 갱신
        if (localOrganization) {
          initialState = { ...initialState, organization: localOrganization };
        }
      }

      setGlobalState({
        ...initialState,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
    }
  }

  DOMStr() {
    const path = window.location.pathname;
    const Component = resolveComponent(path);

    return `
      <div>
        ${isLoading() ? new Loader().render() : new Component().render()}
      </div>`;
  }

  async storeState() {
    try {
      if (getUser()) {
        await storeOnServer();
      } else {
        storeOnLocalStorage();
      }
    } catch (err) {
      console.error(err);
    }
  }

  setEvent() {
    return [
      {
        type: 'beforeunload',
        selector: 'window',
        handler: this.storeState.bind(this),
      },
    ];
  }
}
