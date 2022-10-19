import { Component } from '../../../library/CBD/index.js';
import style from './Counter.module.css';

export default class Counter extends Component {
  constructor(props) {
    super(props);

    [this.state, this.setState] = this.useState({ count: 0 });
  }

  DOMStr() {
    const { minCount, maxCount } = this.props;
    return `
      <div class=${style.container}>
        <button class="${style.decreaseBtn}" ${this.state.count <= minCount ? 'disabled' : ''}>-</button>
        <div class="counter ${style.count}">${this.state.count}</div>
        <button class="${style.increaseBtn}" ${this.state.count >= maxCount ? 'disabled' : ''}>+</button>
      </div>`;
  }

  decrease() {
    this.setState({ count: this.state.count - 1 });
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  getCount() {
    return this.state.count;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.decreaseBtn}`,
        handler: () => this.decrease(),
      },
      {
        type: 'click',
        selector: `.${style.increaseBtn}`,
        handler: () => this.increase(),
      },
    ];
  }
}
