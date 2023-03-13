import { Component } from '../../../library/CBD/index.js';
import { ONBOARDING_ID } from '../../constants/onboarding';
import style from './Counter.module.css';

export default class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 1 };
  }

  DOMStr() {
    const { minCount, maxCount } = this.props;
    return `
      <div class=${style.container} data-onboarding-id="${ONBOARDING_ID.SELECT_GROUP_CNT}">
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
