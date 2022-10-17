import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import Counter from '../../components/Counter.js';
import { Link } from '../../../library/SPA-router/index.js';
import solver from '../../../core/solver.js';
import style from './NewGroup.module.css';

export default class NewGroup extends Component {
  render() {
    const memberCnt = this.props.organization.members.length;
    return `
      ${new MainLayout(this.props).render()}
      <div class="mainContainer">
        <h2>Make New Group</h2>
        <p class=${memberCnt === 0 ? style.errorMsg : ''}>Current member count: ${memberCnt}</p>
        <p>How many groups do you want?</p>
        ${new Counter(this.props).render()}
        <button class="manualGroupBtn">MANUALLY CREATE GROUPS</button>
        <button class="optimizedGroupBtn">CREATE OPTIMIZED GROUPS</button>
      </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.optimizedGroupBtn',
        handler: () => {
          const data = {
            groupNum: 5,
            records: this.props.organization.records,
            peopleArr: this.props.organization.members,
            totalPeopleNum: this.props.organization.members.length,
            forbiddenPairs: [],
          };
          console.log(data);
          const { newRecord, roundScore, weights } = solver(data);
          console.log(newRecord, roundScore, weights);
          // this.renderResult({
          //   members: this.state.members,
          //   record: newRecord,
          // });
        },
      },
    ];
  }
}
