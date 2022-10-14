const KEY = 'state';

// localStorage에 state를 저장한다.
export const saveState = newState => {
  const serialized = JSON.stringify(newState);
  localStorage.setItem(KEY, serialized);
};

// localStorage에서 state를 취득한다.
export const loadState = (initialState = {}) => {
  const serialized = localStorage.getItem(KEY);
  return JSON.parse(serialized) || initialState;
};
