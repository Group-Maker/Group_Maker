import axios from 'axios';
import { Component } from './library/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './pages/index.js';
import style from './App.module.css';

const GUEST = 'guest';
const MEMBER = 'member';

export default class App extends Component {
  constructor() {
    super();
    // 초기 상태 뭘로 할지 생각해봐야 함
    const initialState = {
      path: window.location.pathname,
      userType: GUEST,
      organization: {
        members: [],
        records: [],
      },
    };
    this.state = initialState;
    // 라우팅 관련 변수 함수 분리하는게 맞나 고민중
    this.routes = [
      { path: '/', Component: Members },
      { path: '/signin', Component: SignIn, accessibleUserType: [GUEST], redirectionPath: '/' },
      { path: '/signup', Component: SignUp, accessibleUserType: [GUEST], redirectionPath: '/' },
      { path: '/newgroup', Component: NewGroup },
      { path: '/records', Component: Records },
      { path: '/result', Component: Result },
    ];
    (async () => {
      await this.fetchState();
    })();
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render = path => {
    const _path = path ?? window.location.pathname;
    try {
      const Component = this.routes.find(route => route.path === _path)?.Component ?? NotFound;

      return new Component({
        navigate: this.navigate.bind(this),
      }).render();
    } catch (err) {
      console.error(err);
    }
  };

  navigate(path) {
    if (window.location.pathname === path) {
      return;
    }
    const nextRoute = this.routes.find(route => route.path === path);
    if (!nextRoute) {
      window.history.pushState(null, null, path);
      this.setState({ path });
      return;
    }
    const { accessibleUserType, redirectionPath } = nextRoute;
    const isAccessible = !accessibleUserType || accessibleUserType.includes(this.state.userType);

    window.history.pushState(null, null, isAccessible ? path : redirectionPath);
    this.setState({ path: isAccessible ? path : redirectionPath });
  }

  async fetchState() {
    try {
      const response = await axios.get('/auth/check');
      const { userType } = response.data;
      let organization;

      if (userType === GUEST) {
        // 로컬스토리지 깔끔하게 분리하는게 좋을듯?
        organization = localStorage.getItem('state') ?? organization;
      }
      if (userType === MEMBER) {
        // api 주소 이름 무조건 고쳐야 함 data가 뭐냐!
        // fetch하는 함수 & base_url 같은 것도 분리&정리하는게 좋을듯?
        const response = await axios.get('/api/organization');
        organization = response.data;
      }
      this.setState({ userType, organization });
    } catch (err) {
      console.error(err);
    }
  }

  setEvent() {
    return [
      {
        type: 'popstate',
        selector: 'window',
        handler: () => {
          this.setState({ path: window.location.pathname });
        },
      },
    ];
  }
}
