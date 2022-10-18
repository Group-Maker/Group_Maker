import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import solver from '../../../core/solver.js';
import style from './NewGroup.module.css';

export default class SelectGroupCnt extends Component {
  constructor(props, setState) {
    super(props);
    this.setState = setState;
    this.memberCnt = props.organization.members.length;
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
            records: this.props.organization.records,
            groupNum: this.groupCounter.getCount(),
            peopleArr: this.props.organization.members.map(member => member.id),
            totalPeopleNum: this.props.organization.members.length,
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
