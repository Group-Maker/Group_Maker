import { Component } from '../../../library/CBD/index.js';
import solver from '../../core/solver.js';
import { getMemberIds, getMembersLength, getRecords } from '../../state/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import SelectGroupCnt from './SelectGroupCnt.js';
import Result from './Result.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      groupCnt: 1,
      currentView: 'selectGroupCnt',
    };
  }

  DOMStr() {
    // prettier-ignore
    return `
      <div class="mainContainer">
        ${new MainLayout().render()}
        <main class="main">
          ${
            this.state.currentView === 'selectGroupCnt'
              ? new SelectGroupCnt({
                  createManualGroup: this.createManualGroup.bind(this),
                  createOptimizedGroup: this.createOptimizedGroup.bind(this),
                }).render()
              : new Result({
                  resultState: this.state,
                  resetGroup: this.resetGroup.bind(this),
                  returnToSelectCount: this.returnToSelectCount.bind(this),
                }).render()
          }
        </main>
      </div>`;
  }

  createOptimizedGroup(groupCnt) {
    const data = {
      records: getRecords().map(({ record }) => record),
      groupNum: groupCnt,
      peopleArr: getMemberIds(),
      totalPeopleNum: getMembersLength(),
      forbiddenPairs: [],
    };
    console.log(getRecords().map(({ record }) => record));
    const { newRecord } = solver(data);
    this.setState({
      result: newRecord,
      groupCnt,
      currentView: 'autoResult',
    });
  }

  createManualGroup(groupCnt) {
    this.setState({
      result: Array.from({ length: groupCnt }, () => []),
      groupCnt,
      currentView: 'manualResult',
    });
  }

  resetGroup() {
    const { currentView, groupCnt } = this.state;
    currentView === 'manualResult' ? this.createManualGroup(groupCnt) : this.createOptimizedGroup(groupCnt);
  }

  returnToSelectCount() {
    this.setState(prevState => ({ ...prevState, currentView: 'selectGroupCnt' }));
    console.log(this.state);
  }
}
