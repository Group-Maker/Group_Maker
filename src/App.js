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
    [this.state, this.setState] = this.useState({
      isLoading: true,
      isSignedIn: false,
      organization: {
        members: [],
        records: [],
      },
    });

    // 함수 이름 변경 필요
    this.useEffect(() => {
      console.log('effect');
      this.init();
    }, []);
  }

  async init() {
    try {
      const response = await axios.get('/auth/check');
      const initialState = response.data;

      if (!initialState.organization) {
        const localOrganization = loadOrganization();
        if (localOrganization) {
          initialState.organization = localOrganization;
        }
      }

      this.setState(prevState => ({
        ...prevState,
        ...initialState,
        isLoading: false,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render() {
    // console.log(this.state.organization);
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
      addMember: this.addMember.bind(this),
      updateMember: this.updateMember.bind(this),
      removeMember: this.removeMember.bind(this),
    }).render();
  }

  signInSetState = user => {
    this.setState(prevState => ({
      ...prevState,
      isSignedIn: true,
      organization: user.organization,
    }));
  };

  signOut() {
    document.cookie = 'accessToken =; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    this.setState(prevState => ({
      ...prevState,
      isSignedIn: false,
    }));
  }

  getNextMemberId() {
    return Math.max(...this.state.organization.members.map(member => member.id), 0) + 1;
  }

  addMember(name) {
    const members = [...this.state.organization.members, { id: this.getNextMemberId(), name, isActive: true }];
    this.setState(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        members,
      },
    }));
  }

  removeMember(id) {
    const members = this.state.organization.members.filter(member => member.id !== id);
    this.setState(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        members,
      },
    }));
  }

  updateMember({ id, name }) {
    const members = this.state.organization.members.map(member => (member.id === id ? { ...member, name } : member));
    this.setState(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        members,
      },
    }));
  }
}
