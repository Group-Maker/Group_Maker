import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { loadFromLocalStorage, storeOnLocalStorage, setPageTitle } from './utils/index.js';
import storeOnServer from './api/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import { getInitialState, getUser, getIsLoading, setGlobalState } from './state/index.js';
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
  didMount() {
    this.init();
    // 테스트 해봐야 함
    // 1. 비동기 처리가 어떤 흐름으로 이어지는지 (await을 쓰느냐 마느냐)
    // 1-1. await을 쓰려면 래퍼함수로 한 번 감싸야 하는데, 그 경우에 this바인딩은 어떻게 되나
    // 2. 저장에 실패하는 경우에 대한 fallback 처리를 어떻게 할건지
    window.addEventListener('beforeunload', this.storeState);
  }

  didUpdate() {
    setPageTitle();
  }

  DOMStr() {
    const path = window.location.pathname;
    const Component = resolveComponent(path);

    return `
      <div>
        ${getIsLoading() ? new Loader().render() : new Component().render()}
      </div>`;
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
}
