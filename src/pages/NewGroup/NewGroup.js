import { Component } from '../../../library/CBD/index.js';
import solver from '../../core/solver.js';
import { getMemberIds, getMembersLength, getRecords } from '../../state/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import SelectGroupCnt from './SelectGroupCnt.js';
import Result from './Result.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);

    [this.resultState, this.setState] = this.useState({
      result: null,
      currentView: 'selectGroupCnt',
    });
  }

  createNewGroup(groupCnt) {
    const data = {
      records: getRecords(),
      groupNum: groupCnt,
      peopleArr: getMemberIds(),
      totalPeopleNum: getMembersLength(),
      forbiddenPairs: [],
    };
    const { newRecord } = solver(data);
    this.props.setState({ result: newRecord, currentView: 'autoResult' });
    console.log(newRecord);
  }

  DOMStr() {
    // prettier-ignore
    return `
      <div class="mainContainer">
        ${new MainLayout().render()}
        <main class="main">
          ${this.resultState.currentView === 'selectGroupCnt'
            ? new SelectGroupCnt({ setState: this.setState, createNewGroup:this.createNewGroup }).render()
            : new Result({ resultState: this.resultState, createNewGroup:this.createNewGroup }).render()}
        </main>
      </div>`;
  }
}
