import { getOrganization } from '../state';

const KEY = 'organization';

// localStorage에 state를 저장한다.
const storeOnLocalStorage = () => {
  const serialized = JSON.stringify(getOrganization());
  localStorage.setItem(KEY, serialized);
};

// localStorage에서 state를 취득한다.
const loadFromLocalStorage = () => {
  const serialized = localStorage.getItem(KEY);
  return JSON.parse(serialized);
};

export { storeOnLocalStorage, loadFromLocalStorage };
