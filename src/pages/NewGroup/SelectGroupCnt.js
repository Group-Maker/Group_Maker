import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import { getMembersLength } from '../../state/index.js';
import style from './NewGroup.module.css';

export default class SelectGroupCnt extends Component {
  constructor(props) {
    super(props);

    this.memberCnt = getMembersLength();
    this.groupCounter = new Counter({ ...this.props, minCount: 0, maxCount: this.memberCnt });
  }

  render() {
    return `
      <h2 class="title">Make New Group</h2>
      <p class=${this.memberCnt ? '' : style.errorMsg}>Current member count: ${this.memberCnt}</p>
      <p>How many groups do you want?</p>
      ${this.groupCounter.render()}
      <button class="manualGroupBtn" ${
        this.groupCounter.getCount() ? '' : 'disabled'
      }>MANUALLY<br>CREATE GROUPS</button>
      <button class="optimizedGroupBtn" ${
        this.groupCounter.getCount() ? '' : 'disabled'
      }>CREATE<br>OPTIMIZED GROUPS</button>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.optimizedGroupBtn',
        handler: () => this.props.createNewGroup(this.groupCounter.getCount()),
      },
      {
        type: 'click',
        selector: '.manualGroupBtn',
        handler: () => {
          const groupNum = this.groupCounter.getCount();
          this.props.setState({ result: Array.from({ length: groupNum }, () => []), currentView: 'manualResult' });
        },
      },
    ];
  }
}
