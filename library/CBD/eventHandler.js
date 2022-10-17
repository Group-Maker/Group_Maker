const validateEventHandler = eventHandlers => {
  // 객체의 프로퍼티 중 하나라도 빠지면 에러

  if (!Array.isArray(eventHandlers)) {
    throw new TypeError(`Use Array type for handlers parameter`);
  }

  eventHandlers.forEach(({ type, handler, selector }) => {
    Object.entries({ type, handler, selector }).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`${key} is essential parameter`);
      }
    });
    // 커스텀 이벤트를 사용할 수도 있기 때문에 빌트인 이벤트만으로 유효성 검사 방법 더 고민해봐야함

    // 핸들러 중복 등록을 방지하기 위해 익명함수를 사용하지 못하도록 함

    if (handler.name === '' || handler.name === 'default' || handler.name === 'anonymous') {
      throw new Error('Use named function for event handler');
    }

    // 제대로 된 CSS 선택자인지 확인

    document.querySelector(selector);
  });
};

const handlersHolder = [];

const addEventHandlers = eventHandlers => {
  validateEventHandler(eventHandlers);
  eventHandlers.forEach(eventHandler => {
    const isDuplicated = handlersHolder.find(
      ({ type, selector }) => type === eventHandler.type && selector === eventHandler.selector
    );
    if (isDuplicated) {
      return;
    }

    const { type, selector, handler } = eventHandler;
    window.addEventListener(type, e => {
      if (e.target === window || e.target === document || e.target.closest(selector)) {
        handler(e);
      }
    });
    handlersHolder.push(eventHandler);
  });
};

export default addEventHandlers;
