import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { loadOrganization, saveOrganization } from './utils/localStorage.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import { getOrganization, getUser, isLoading, setGlobalState } from './state/index.js';
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
  constructor() {
    super();

    // TODO: 함수 이름 변경 필요
    this.useEffect(() => {
      this.init();
    }, []);
  }

  async init() {
    try {
      const { data: initialState } = await axios.get('/auth/check');

      // 가독성 더 좋게 쓸 수 있을지 고민해봅시다!
      if (!initialState.organization) {
        const localOrganization = loadOrganization();
        if (localOrganization) {
          initialState.organization = localOrganization;
        } else {
          const organization = getOrganization();
          saveOrganization(organization);
        }
      }

      setGlobalState({
        isLoading: false,
        ...initialState,
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render() {
    if (isLoading()) {
      return new Loader().render();
    }
    const path = window.location.pathname;
    const Component = resolveComponent(path);

    return new Component().render();
  }
}
