import render from './render.js';
import addEventHandlers from './eventHandler.js';

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.setEvent && addEventHandlers(this.setEvent());
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    render();
  }

  render() {
    throw new Error('render함수를 써라!');
  }
}

export default Component;
