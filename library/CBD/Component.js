import { render, componentTree } from './render';
import { validateEventHandlerInfo } from './eventHandler';

class Component {
  constructor(props) {
    this.props = props;
    this.state = null;

    this.id = this.constructor.name + '-' + self.crypto.randomUUID().slice(0, 8);
    this.isMounted = false;
    this.eventHandlers = null;

    this.bindEventHandlers();
    componentTree.add(this);
  }

  setState(nextState) {
    if (this.state === nextState) {
      return;
    }

    this.state = typeof nextState === 'function' ? nextState(this.state) : nextState;

    render(document.querySelector(`[data-component-id="${this.id}"]`), this);
  }

  render() {
    componentTree.pushToCallStack(this.id);
    const labledDOMStr = this.labelDOMStr(this.DOMStr().trim());
    componentTree.popCallStack();
    return labledDOMStr;
  }

  DOMStr() {
    throw new Error('domStr함수를 써라!');
  }

  labelDOMStr(DOMStr) {
    const isComponentIdExist = /^<.*(data-component-id=)+.*>/.test(DOMStr);
    if (isComponentIdExist) {
      throw new Error('컴포넌트는 무조건 하나의 요소로 감싸야 합니다');
    }

    return DOMStr.replace(/<[^>]*>/, openTag => `${openTag.slice(0, -1)} data-component-id="${this.id}"/>`);
  }

  bindEventHandlers() {
    if (this.setEvent) {
      const eventHandlers = this.setEvent();
      validateEventHandlerInfo(eventHandlers);

      this.eventHandlers = eventHandlers.map(handlerInfo => {
        const { selector, handler } = handlerInfo;
        const wrappedHandler = e => {
          if (e.target.closest(selector)) {
            handler(e);
          }
        };

        return { ...handlerInfo, id: this.id, handler: wrappedHandler };
      });
    }
  }
}

export default Component;
