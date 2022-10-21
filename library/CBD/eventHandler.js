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

    // if (handler.name === '' || handler.name === 'default' || handler.name === 'anonymous') {
    //   throw new Error('Use named function for event handler');
    // }

    // 제대로 된 CSS 선택자인지 확인

    // document.querySelector(selector);
  });
};

let handlersHolder = [];

// 지역 상태를 사용함에 따라, 상태를 가지는 컴포넌트의 인스턴스가 재생성되면 해당 상태에 의존하는 이벤트 핸들러를 새로 달아주어야 정상 동작한다.
// 이벤트 핸들러를 새로 달아주지 않으면, 기존의 핸들러가 렌더링 이후 사라져버린 이전 컴포넌트를 클로저로 참조하기 때문에 제대로 동작하지 않는다.
// 이벤트 핸들러를 넘겨줄 때 이벤트 타깃이 아닌 컴포넌트의 인스턴스를 this로 참조하게 하기 위하여 bind(this)를 통해 this를 고정해준다.
// 이벤트 핸들러를 새로 달아주지 않으면 컴포넌트가 새로운 상태를 가진 새로운 인스턴스를 생성하여도 this가 고정되어있기 때문에 항상 같은 값을 참조하게 된다

const holdEventHandlers = eventHandlers => {
  validateEventHandler(eventHandlers);
  eventHandlers.forEach(eventHandler => {
    const { selector, handler } = eventHandler;
    eventHandler.handler = e => {
      if (selector === 'window' || selector === 'document' || e.target.closest(selector)) {
        handler(e);
      }
    };

    handlersHolder.push(eventHandler);
  });
};

const updateEventHandlers = () => {
  const removeHandlers = [];

  handlersHolder.forEach(handlerInfo => {
    const { id, type, handler } = handlerInfo;

    if (document.querySelector(`[data-component-id="${id}"]`) || type === 'beforeunload') {
      window.addEventListener(type, handler);
    } else {
      window.removeEventListener(type, handler);
      removeHandlers.push(handlerInfo);
    }
  });

  handlersHolder = handlersHolder.filter(handlerInfo => !removeHandlers.includes(handlerInfo));
};

export { updateEventHandlers, holdEventHandlers };
