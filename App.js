// import axios from 'axios';
import { Component } from './src/library/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './src/pages/index.js';

const GUEST = 'guest';
const MEMBER = 'member';

export default class App extends Component {
  constructor() {
    super();
    // 초기 상태 뭘로 할지 생각해봐야 함
    const initialState = {
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

    this.fetchState();
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render = path => {
    const _path = path ?? window.location.pathname;

    try {
      const { Component, accessibleUserType, redirectionPath } =
        this.routes.find(route => route.path === _path) || NotFound;
      if (accessibleUserType && !accessibleUserType.includes(this.state.userType)) {
        const RedirectionComponent = this.routes.find(route => route.path === redirectionPath)?.Component || NotFound;
        return new RedirectionComponent().render();
      }
      return new Component().render();
    } catch (err) {
      console.error(err);
    }
  };

  navigate(e) {
    if (!e.target.matches('a')) {
      return;
    }
    e.preventDefault();

    const path = e.target.getAttribute('href');
    if (window.location.pathname === path) {
      return;
    }

    window.history.pushState(null, null, path);
    this.render(path);
  }

  async fetchState() {
    try {
      const response = await axios.get('/api/user');
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
        type: 'click',
        selector: 'window',
        handler: this.navigate,
      },
      {
        type: 'popstate',
        selector: 'window',
        handler: this.render,
      },
    ];
  }
}
