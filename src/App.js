import axios from 'axios';
import { Component } from '../library/CBD/index.js';
import { createRoutes, navigate, resolveComponent } from '../library/SPA-router/index.js';
import { LocalStorage, ORGANIZATION_KEY, setPageTitle } from './utils/index.js';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from './pages/index.js';
import Loader from './components/Loading/Loader.js';
import Onboarding, { ONBOARDING_PLACEMENT } from './components/Onboarding/Onboarding.js';
import { ONBOARDING_ID } from './constants/onboarding';
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
                steps: this.onboardingSteps,
                stepIndex: getCurrentStep(),
                callback: this.handleOnboarding.bind(this),
                onFinish: disableOnboarding,
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

  onboardingSteps = [
    {
      title: 'Welcome to Optimal Group Generator!',
      content: "Let's begin super simple and easy tutorials.",
      placement: ONBOARDING_PLACEMENT.CENTER,
    },
    {
      title: 'Manage Members',
      content: 'You can manage your members here.',
      target: `[data-onboarding-id="${ONBOARDING_ID.MEMBERS_PAGE}"]`,
      placement: ONBOARDING_PLACEMENT.RIGHT,
      page: '/',
    },
    {
      title: 'Add Member',
      content: "Write member's name and press Enter.<br />At least 1 member is needed to generate group.",
      target: `[data-onboarding-id="${ONBOARDING_ID.ADD_MEMBER}"]`,
      placement: ONBOARDING_PLACEMENT.TOP,
      page: '/',
    },
    {
      title: 'Previous Records',
      content: 'You can review and remove previous records here.',
      target: `[data-onboarding-id="${ONBOARDING_ID.RECORDS_PAGE}"]`,
      placement: ONBOARDING_PLACEMENT.RIGHT,
      page: '/records',
    },
    {
      title: 'Generate New Group',
      content: 'You can generate new group here.',
      target: `[data-onboarding-id="${ONBOARDING_ID.NEW_GROUP_PAGE}"]`,
      placement: ONBOARDING_PLACEMENT.RIGHT,
      page: '/newgroup',
    },
    {
      title: 'Select the number of groups',
      content: "Click '+' and '-' button to control the number of groups.",
      target: `[data-onboarding-id="${ONBOARDING_ID.SELECT_GROUP_CNT}"]`,
      placement: ONBOARDING_PLACEMENT.LEFT,
      page: '/newgroup',
    },
    {
      title: 'Generate optimized groups',
      content: 'Be with new people!<br />We care all about tedious calculation.',
      target: `[data-onboarding-id="${ONBOARDING_ID.OPTIMAL_GENERATE}"]`,
      placement: ONBOARDING_PLACEMENT.TOP,
      page: '/newgroup',
    },
    {
      title: 'Generate group manually',
      content: 'You can generate group manually either.<br />Just Drag&Drop to assign members to group.',
      target: `[data-onboarding-id="${ONBOARDING_ID.MANUAL_GENERATE}"]`,
      placement: ONBOARDING_PLACEMENT.TOP,
      page: '/newgroup',
    },
    {
      title: 'Congratulations!',
      content: "That's all!<br />Now manage your groups with Optimal-Group-Generator.",
      page: '/',
    },
  ];

  handleOnboarding(step) {
    const onboardPage = this.onboardingSteps[step]?.page;
    onboardPage && navigate(onboardPage);
    const isFinished = step >= this.onboardingSteps.length;
    isFinished ? disableOnboarding() : stepTo(step);
  }
}
