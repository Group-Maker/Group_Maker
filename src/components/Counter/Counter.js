import { Component } from '@@/CBD';
import style from './Counter.module.css';

export class Counter extends Component {
  DOMStr() {
    const { minCount, maxCount } = this.props;
    return `
      <div class=${style.container}>
        <button class="${style.decreaseBtn}" ${this.props.count <= minCount ? 'disabled' : ''}>-</button>
        <div class="counter ${style.count}">${this.props.count}</div>
        <button class="${style.increaseBtn}" ${this.props.count >= maxCount ? 'disabled' : ''}>+</button>
      </div>`;
  }

  decrease() {
    this.props.setGroupCnt(this.props.count - 1);
  }

  increase() {
    this.props.setGroupCnt(this.props.count + 1);
  }

  getCount() {
    return this.props.count;
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
