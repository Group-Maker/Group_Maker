import { render } from './library/index.js';

let _routes = null;

// 사용자가 넘겨준 routers 배열을 가지고 있음
const createRoutes = routes => {
  _routes = routes;
};

const findRoute = path => _routes.find(route => route.path === path) ?? _routes.find(route => route.path === '*');

const resolveComponent = path => findRoute(path).component;

// 주소를 바꿔줘!
const navigate = path => {
  if (path === window.location.pathname) {
    return;
  }

  window.history.pushState(null, null, path);
  render();
};

export { createRoutes, resolveComponent, navigate };
