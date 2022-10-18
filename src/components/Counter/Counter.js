import { Component } from '../../../library/CBD/index.js';
import style from './Counter.module.css';

export default class Counter extends Component {
  constructor(props, minCount, maxCount) {
    super(props);
    [this.state, this.setState] = this.useState({ count: 0 });
    this.minCount = minCount;
    this.maxCount = maxCount;
  }

  render() {
    return `
      <div class=${style.container}>
        <button class="decrease ${style.button}" ${this.state.count <= this.minCount ? 'disabled' : ''}>-</button>
        <div class="counter ${style.count}">${this.state.count}</div>
        <button class="increase ${style.button}" ${this.state.count >= this.maxCount ? 'disabled' : ''}>+</button>
      </div>`;
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  decrease() {
    this.setState({ count: this.state.count - 1 });
  }

  getCount() {
    return this.state.count;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.increase',
        handler: () => this.increase(),
      },
      {
        type: 'click',
        selector: '.decrease',
        handler: () => this.decrease(),
      },
    ];
  }
}
