// import axios from 'axios';
import { Component } from './src/library/index.js';
import { Intro, SignIn, SignUp, NewGroup, Members, Records, Result, NotFound } from './src/pages/index.js';

export default class App extends Component {
  constructor() {
    super();
    // 초기 상태 뭘로 할지 생각해봐야 함
    this.state = {
      userType: null,
      data: {
        members: [],
        records: [],
      },
    };
    // 라우팅 관련 변수 함수 분리하는게 맞나 고민중
    this.routes = [
      { path: '/', Component: Intro, accessible: 'guest', redirectionPath: '/members' },
      { path: '/signin', Component: SignIn, accessible: 'guest', redirectionPath: '/members' },
      { path: '/signup', Component: SignUp, accessible: 'guest', redirectionPath: '/members' },
      { path: '/newgroup', Component: NewGroup },
      { path: '/members', Component: Members },
      { path: '/records', Component: Records },
      { path: '/result', Component: Result },
    ];

    this.fetchState();
  }

  // 코드 더 깨끗하게 쓸 수 있을지 생각해보자!
  render = path => {
    const _path = path ?? window.location.pathname;

    try {
      const { Component, accessible, redirectionPath } = this.routes.find(route => route.path === _path) || NotFound;
      if (accessible !== this.state.userType) {
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
      const response = await axios.get('/user');
      const { userType } = response.data;

      let data = { members: [], records: [] };
      if (userType === 'guest') {
        // 로컬스토리지 깔끔하게 분리하는게 좋을듯?
        data = localStorage.getItem('state') ?? data;
      } else {
        // api 주소 이름 무조건 고쳐야 함 data가 뭐냐!
        // fetch하는 함수 & base_url 같은 것도 분리&정리하는게 좋을듯?
        const response = await axios.get('/api/data');
        data = response.data;
      }
      this.setState({ userType, data });
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
