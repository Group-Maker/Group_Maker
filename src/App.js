import axios from 'axios';
import style from './App.module.css';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
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

    [this.state, this.setState] = this.useState({
      isLoading: true,
      isSignedIn: false,
      organization: {
        members: [],
        records: [],
      },
    });

    // TODO: 함수 이름 변경 필요
    this.useEffect(() => {
      this.init();
    }, []);
  }

  async init() {
    try {
      // const response = await axios.get('/auth/check');
      // const initialState = response.data;
      const { data: initialState } = await axios.get('/auth/check');

      if (!initialState.organization) {
        const localOrganization = loadOrganization();
        if (localOrganization) {
          initialState.organization = localOrganization;
        }
      }
      this.setState(prevState => ({ ...prevState, isLoading: false, ...initialState }));
    } catch (err) {
      console.error(err);
    }
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render() {
    console.log('RENDER', this.state);
    if (this.state.isLoading) {
      return new Loader().render();
    }
    const path = window.location.pathname;
    const Component = resolveComponent(path);

    const { isSignedIn, organization } = this.state;

    return new Component({
      isSignedIn,
      organization,
      signInSetState: this.signInSetState.bind(this),
      signOut: this.signOut.bind(this),
    }).render();
  }

  // TODO: 적절한 이름 찾기
  signInSetState = user => {
    this.setState(prevState => ({
      ...prevState,
      isSignedIn: true,
      organization: user.organization,
    }));
  };

  async signOut() {
    try {
      await axios.get('/auth/signout');
      this.setState(prevState => ({
        ...prevState,
        isSignedIn: false,
      }));
    } catch (err) {
      console.log(err);
    }
  }
}
