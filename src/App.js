import { Component } from '@@/CBD';
import { createRoutes, navigate, resolveComponent } from '@@/SPA-router';
import { SignIn, SignUp, NewGroup, Members, Records, NotFound } from '@/pages';
import { Loader, Onboarding } from '@/components';
import { setPageTitle } from '@/utils';
import { ONBOARDING_STEPS, ROUTE_PATH } from '@/constants';
import {
  getOrganizationOnLocal,
  getOrganizationOnServer,
  updateOrganizationOnServer,
  updateOrganizationOnLocal,
  getUserInfo,
} from '@/apis';
import {
  getInitialState,
  getUID,
  checkLoading,
  setGlobalState,
  getOrganization,
  disableOnboarding,
  stepTo,
  getCurrentStep,
  isOnboarding,
} from '@/state';
import './App.module.css';

const routes = [
  { path: ROUTE_PATH.members, component: Members },
  { path: ROUTE_PATH.signin, component: SignIn },
  { path: ROUTE_PATH.signup, component: SignUp },
  { path: ROUTE_PATH.newgroup, component: NewGroup },
  { path: ROUTE_PATH.records, component: Records },
  { path: ROUTE_PATH.wildcard, component: NotFound },
];

createRoutes(routes);

export default class App extends Component {
  didMount() {
    this.init();
    // 테스트 해봐야 함
    // 1. 비동기 처리가 어떤 흐름으로 이어지는지 (await을 쓰느냐 마느냐)
    // 1-1. await을 쓰려면 래퍼함수로 한 번 감싸야 하는데, 그 경우에 this바인딩은 어떻게 되나
    // 2. 저장에 실패하는 경우에 대한 fallback 처리를 어떻게 할건지
  }

  didUpdate() {
    setPageTitle();
  }

  DOMStr() {
    if (checkLoading()) {
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
      const { success, uid, user, userId } = await getUserInfo();
      // 토큰이 있고 유효하면(로그인 성공) 받아온 정보 갱신
      if (success) {
        initialState = { ...initialState, uid, user, userId };

        const organization = await getOrganizationOnServer(uid);
        if (organization) {
          initialState = { ...initialState, organization };
        }
      } else {
        const organization = getOrganizationOnLocal();
        if (organization) {
          initialState = { ...initialState, organization };
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
      const uid = getUID();
      const organization = getOrganization();
      uid ? await updateOrganizationOnServer(uid, organization) : updateOrganizationOnLocal(organization);
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
