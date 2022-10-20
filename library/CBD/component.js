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
    return this.labelDOMStr(this.DOMStr());
  }

  DOMStr() {
    throw new Error('domStr함수를 써라!');
  }

  labelDOMStr(DOMStr) {
    const openTagRegex = /<[^>]*>/;
    return DOMStr.replace(openTagRegex, openTag => `${openTag.slice(0, -1)} data-component-id="${this.componentId}"/>`);
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
