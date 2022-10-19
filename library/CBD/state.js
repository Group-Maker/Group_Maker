import render from './render.js';

const hooks = [];
let hookIdx = 0;

const resetHookIdx = () => {
  hookIdx = 0;
};

const useEffect = (callback, depArray) => {
  const currentHookIdx = hookIdx;
  const hasNoDeps = !depArray;
  const _deps = hooks[currentHookIdx];
  const hasDepsChanged = _deps ? !depArray.every((el, idx) => el === _deps[idx]) : true;

  if (hasNoDeps || hasDepsChanged) {
    callback();
    hooks[currentHookIdx] = depArray;
  }
  hookIdx += 1;
};

const useLocalState = initialState => {
  console.log(hooks);
  hooks[hookIdx] = hooks[hookIdx] || initialState;

  const currentHookIdx = hookIdx;

  const setState = nextState => {
    hooks[currentHookIdx] = typeof nextState === 'function' ? nextState(hooks[currentHookIdx]) : nextState;

    resetHookIdx();
    render();
  };
  hookIdx += 1;

  return [hooks[currentHookIdx], setState];
};

const useGlobalState = initialState => {
  let state = initialState;

  const setState = nextState => {
    state = typeof nextState === 'function' ? nextState(state) : nextState;

    resetHookIdx();
    render();
  };

  return [state, setState];
};

export { useGlobalState, useLocalState, useEffect, resetHookIdx };
