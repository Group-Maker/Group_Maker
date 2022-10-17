import { Component } from '../../library/CBD/index.js';

export default class Counter extends Component {
  constructor(props) {
    super(props);
    [this.state, this.setState] = this.useState({ num: 0 });
  }

  render() {
    const groupCnt = this.state.num;
    const memberCnt = this.props.organization.members.length;
    return `
      <div class="container">
        <button class="increase" ${groupCnt >= memberCnt ? 'disabled' : ''}>+</button>
        <div class="counter">${groupCnt}</div>
        <button class="decrease" ${groupCnt <= 0 ? 'disabled' : ''}>-</button>
      </div>`;
  }

  increase() {
    this.setState(({ num }) => ({ num: num + 1 }));
  }

  decrease() {
    this.setState(({ num }) => ({ num: num - 1 }));
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
