import { useGlobalState } from '@@/CBD';
import { LocalStorage, ONBOARDING_KEY } from '@/utils/localStorage.js';

const onboardingStorage = new LocalStorage(ONBOARDING_KEY);

const initialState = {
  isOnboarding: onboardingStorage.getItem() ?? true,
  step: 0,
};
const [getOnboarding, setOnboarding] = useGlobalState(initialState);

const isOnboarding = () => getOnboarding().isOnboarding;

const getCurrentStep = () => getOnboarding().step;

const stepTo = step => {
  if (step === getCurrentStep()) {
    return;
  }
  setOnboarding(prev => ({ ...prev, step }));
};

const enableOnboarding = () => {
  onboardingStorage.setItem(true);
  setOnboarding(prev => ({ ...prev, isOnboarding: true }));
};

const disableOnboarding = () => {
  onboardingStorage.setItem(false);
  setOnboarding(prev => ({ ...prev, step: 0, isOnboarding: false }));
};

export { isOnboarding, getCurrentStep, stepTo, enableOnboarding, disableOnboarding };
