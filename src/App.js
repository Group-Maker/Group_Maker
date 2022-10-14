import axios from 'axios';
import { Component } from './library/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './pages/index.js';
import Loader from './components/Loader.js';
import style from './App.module.css';

const GUEST = 'guest';
const MEMBER = 'member';

export default class App extends Component {
  constructor() {
    super();
    // 초기 상태 뭘로 할지 생각해봐야 함
    const initialState = {
      isLoading: true,
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

    this.init();
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render = () => {
    console.log(this.state);
    if (this.state.isLoading) {
      return new Loader().render();
    }

    try {
      const Component = this.routes.find(route => route.path === this.state.path)?.Component ?? NotFound;
      const { path, userType } = this.state;

      return new Component({
        path,
        userType,
        navigate: this.navigate.bind(this),
      }).render();
    } catch (err) {
      console.error(err);
    }
  };

  // 이름 다시 고민해볼 것
  getNextPath(path, userType) {
    const nextRoute = this.routes.find(route => route.path === path);
    if (!nextRoute) {
      return path;
    }

    const { accessibleUserType, redirectionPath } = nextRoute;
    const isAccessible = !accessibleUserType || accessibleUserType.includes(userType);

    return isAccessible ? path : redirectionPath;
  }

  navigate(path) {
    if (window.location.pathname === path) {
      return;
    }
    const nextPath = this.getNextPath(path, this.state.userType);

    window.history.pushState(null, null, nextPath);
    this.setState({ path: nextPath });
  }

  async init() {
    try {
      const response = await axios.get('/auth/check');
      const { userType } = response.data;
      let organization;

      if (userType === GUEST) {
        // 로컬스토리지 깔끔하게 분리하는게 좋을듯?
        organization = localStorage.getItem('state') ?? organization;
      }
      if (userType === MEMBER) {
        // fetch하는 함수 & base_url 같은 것도 분리&정리하는게 좋을듯?
        const response = await axios.get('/api/organization');
        organization = response.data;
      }

      const nextPath = this.getNextPath(window.location.pathname, userType);
      window.history.pushState(null, null, nextPath);

      this.setState({ path: nextPath, isLoading: false, userType, organization });
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
