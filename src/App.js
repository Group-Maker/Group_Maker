import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, resolveComponent } from '../library/SPA-router/index.js';
import { loadOrganization, saveOrganization } from './utils/localStorage.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import { getOrganization, isLoading, setGlobalState } from './state/index.js';
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

    const { organization } = this.state;

    return new Component({
      organization,
      addRecord: this.addRecord.bind(this),
      addMember: this.addMember.bind(this),
      updateMember: this.updateMember.bind(this),
      removeMember: this.removeMember.bind(this),
      removeRecord: this.removeRecord.bind(this),
    }).render();
  }

  // TODO: 적절한 이름 찾기

  getNextId(arr) {
    return Math.max(...arr.map(item => item.id), 0) + 1;
  }

  addRecord(record) {
    const records = [
      ...this.state.organization.records,
      { id: this.getNextId(this.state.organization.records), record },
    ];
    this.setState(prevState => ({
      ...prevState,
      organization: { ...prevState.organization, records },
    }));
  }

  addMember(name) {
    const prevMembers = this.state.organization.members;
    const members = [...prevMembers, { id: this.getNextId(prevMembers), name, isActive: true }];
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

  removeRecord(id) {
    const records = this.state.organization.records.filter(record => record.id !== id);
    this.setState(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        records,
      },
    }));
  }
}
