import { holdEventHandlers } from './eventHandler.js';
import render from './render.js';

class Component {
  constructor(props) {
    this.props = props;
    this.state = null;
    this.componentId = this.constructor.name + '-' + self.crypto.randomUUID().slice(0, 8);

    this.updateEventHandlers();
  }

  setState(nextState) {
    this.state = typeof nextState === 'function' ? nextState(this.state) : nextState;

    render(document.querySelector(`[data-component-id="${this.componentId}"]`), this);
  }

  render() {
    return this.labelDOMStr(this.DOMStr().trim());
  }

  DOMStr() {
    throw new Error('domStr함수를 써라!');
  }

  labelDOMStr(DOMStr) {
    const isComponentIdExist = /^<.*(data-component-id=)+.*>/.test(DOMStr);
    if (isComponentIdExist) {
      throw new Error('컴포넌트는 무조건 하나의 요소로 감싸야 합니다');
    }

    return DOMStr.replace(/<[^>]*>/, openTag => `${openTag.slice(0, -1)} data-component-id="${this.componentId}"/>`);
  }

  updateEventHandlers() {
    if (!this.setEvent) {
      return;
    }
    const labeledHandlerInfo = this.setEvent().map(handlerInfo => ({
      id: this.componentId,
      ...handlerInfo,
    }));

    holdEventHandlers(labeledHandlerInfo);
  }
}

export default Component;
