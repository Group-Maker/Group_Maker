import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, navigate, resolveComponent } from '../library/SPA-router/index.js';
import { LocalStorage, ORGANIZATION_KEY, setPageTitle } from './utils/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import Onboarding from './components/Onboarding/Onboarding.js';
import { ONBOARDING_STEPS } from './constants/onboarding';
import {
  getInitialState,
  getUser,
  getIsLoading,
  setGlobalState,
  getOrganization,
  disableOnboarding,
  stepTo,
  getCurrentStep,
  isOnboarding,
} from './state/index.js';
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
  organizationStorage = new LocalStorage(ORGANIZATION_KEY);

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
    if (getIsLoading()) {
      return /* html */ `
        <div>
          ${new Loader().render()}
        </div>`;
    }

    const path = window.location.pathname;
    const Component = resolveComponent(path);
    return /* html */ `
      <div>
        ${new Component().render()}
        ${
          isOnboarding()
            ? new Onboarding({
                steps: ONBOARDING_STEPS,
                stepIndex: getCurrentStep(),
                callback: this.handleOnboarding.bind(this),
                onFinish: () => this.handleOnboarding(ONBOARDING_STEPS.length - 1),
              }).render()
            : ''
        }
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
        const localOrganization = this.organizationStorage.getItem();
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
      const user = getUser();
      const organization = getOrganization();
      if (user) {
        const payload = { userId: user.id, newOrganization: organization };
        await axios.post('/organization', payload);
      } else {
        this.organizationStorage.setItem(organization);
      }
    } catch (err) {
      console.error(err);
    }
  }

  handleOnboarding(step) {
    const onboardPage = ONBOARDING_STEPS[step]?.page;
    onboardPage && navigate(onboardPage);
    const isFinished = step >= ONBOARDING_STEPS.length;
    isFinished ? disableOnboarding() : stepTo(step);
  }
}
