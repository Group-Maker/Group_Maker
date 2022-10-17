import { holdEventHandlers } from './eventHandler.js';
import { useLocalState, useEffect } from './state.js';

class Component {
  constructor(props) {
    this.props = props;
    this.useState = useLocalState;
    this.useEffect = useEffect;
    this.setEvent && holdEventHandlers(this.setEvent());
  }

  render() {
    throw new Error('render함수를 써라!');
  }
}

export default Component;
