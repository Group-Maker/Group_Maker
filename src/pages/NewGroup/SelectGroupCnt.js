import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import solver from '../../../core/solver.js';
import style from './NewGroup.module.css';
import { getMemberIds, getMembers, getMembersLength, getRecords } from '../../state/index.js';

export default class SelectGroupCnt extends Component {
  constructor(props, setState) {
    super(props);
    this.setState = setState;
    this.memberCnt = getMembersLength();
    this.groupCounter = new Counter(this.props, 0, this.memberCnt);
  }

  render() {
    return `
      <h2>Make New Group</h2>
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
        handler: () => {
          const data = {
            records: getRecords(),
            groupNum: this.groupCounter.getCount(),
            peopleArr: getMemberIds(),
            totalPeopleNum: getMembersLength(),
            forbiddenPairs: [],
          };
          const { newRecord } = solver(data);
          this.setState({ result: newRecord });
          console.log(newRecord);
        },
      },
    ];
  }
}
