const KEY = 'organization';

// localStorage에 state를 저장한다.
export const saveOrganization = newOrganization => {
  const serialized = JSON.stringify(newOrganization);
  localStorage.setItem(KEY, serialized);
};

// localStorage에서 state를 취득한다.
export const loadOrganization = () => {
  const serialized = localStorage.getItem(KEY);
  return JSON.parse(serialized);
};
