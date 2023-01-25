const isValidEventHandlerInfo = info => {
  const { type, handler, selector } = info;
  return Object.entries({ type, handler, selector }).every(([, value]) => value);
};

const validateEventHandlerInfo = eventHandlers => {
  // 객체의 프로퍼티 중 하나라도 빠지면 에러

  if (!Array.isArray(eventHandlers)) {
    throw new TypeError(`Use Array type for handlers parameter`);
  }

  const isValid = eventHandlers.every(isValidEventHandlerInfo);

  if (!isValid) {
    throw new Error(`이벤트 핸들러 정보를 담은 객체는 'type', 'handler', 'selector' 프로퍼티를 모두 포함해야 합니다.`);
  }
  // 커스텀 이벤트를 사용할 수도 있기 때문에 빌트인 이벤트만으로 유효성 검사 방법 더 고민해봐야함

  // 핸들러 중복 등록을 방지하기 위해 익명함수를 사용하지 못하도록 함

  // if (handler.name === '' || handler.name === 'default' || handler.name === 'anonymous') {
  //   throw new Error('Use named function for event handler');
  // }

  // 제대로 된 CSS 선택자인지 확인

  // document.querySelector(selector);
};

const subscribeEvents = eventHandlers => {
  eventHandlers.forEach(eventHandler => {
    const { selector, handler, type } = eventHandler;
    const wrappedHandler = e => {
      if (selector === 'window' || selector === 'document' || e.target.closest(selector)) {
        handler(e);
      }
    };

    window.addEventListener(type, wrappedHandler);
  });
};

const unSubscribeEvents = eventHandlers => {
  eventHandlers.forEach(handlerInfo => {
    const { type, handler } = handlerInfo;
    window.removeEventListener(type, handler);
  });
};

export { validateEventHandlerInfo, subscribeEvents, unSubscribeEvents };
