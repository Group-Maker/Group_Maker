import { getOrganization } from '../state';

const KEY = 'organization';

const storeOnLocalStorage = () => {
  const serialized = JSON.stringify(getOrganization());
  localStorage.setItem(KEY, serialized);
};

const loadFromLocalStorage = () => {
  const serialized = localStorage.getItem(KEY);
  return JSON.parse(serialized);
};

export { storeOnLocalStorage, loadFromLocalStorage };
