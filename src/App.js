import axios from 'axios';
import style from './App.module.css';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './pages/index.js';
import Loader from './components/Loader.js';
import { loadOrganization } from './utils/localStorage.js';

const routes = [
  { path: '/', component: Members },
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  { path: '/newgroup', component: NewGroup },
  { path: '/records', component: Records },
  { path: '/result', component: Result },
  { path: '*', component: NotFound },
];

createRoutes(routes);

export default class App extends Component {
  constructor() {
    super();
    // 초기 상태 뭘로 할지 생각해봐야 함
    this.state = {
      isLoading: true,
      isSignedIn: false,
      organization: {
        members: [],
        records: [],
      },
    };

    this.init();
  }

  signInSetState = user => {
    this.setState({ isSignedIn: true, organization: user.organization });
  };

  init = async () => {
    try {
      const response = await axios.get('/auth/check');
      const initialState = response.data;

      if (!initialState.organization) {
        const localOrganization = loadOrganization();
        if (localOrganization) {
          initialState.organization = localOrganization;
        }
      }
      this.setState({ isLoading: false, ...initialState });
    } catch (err) {
      console.error(err);
    }
  };

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render = () => {
    console.log('RENDER', this.state);
    if (this.state.isLoading) {
      return new Loader().render();
    }
    const path = window.location.pathname;
    const Component = resolveComponent(path);

    const { isSignedIn, organization } = this.state;

    return new Component({ isSignedIn, organization, signInSetState: this.signInSetState.bind(this) }).render();
  };
}
