import { Component } from '@@/CBD';
import solver from '@/core/solver';
import { getActiveMembers, getRecords } from '@/state';
import { MainLayout } from '@/components';
import { SelectGroupCnt } from './SelectGroupCnt';
import { Result } from './Result';

export class NewGroup extends Component {
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
          ${this.state.currentView === 'selectGroupCnt'
            ? new SelectGroupCnt({
                count: this.state.groupCnt,
                createManualGroup: this.createManualGroup.bind(this),
                createOptimizedGroup: this.createOptimizedGroup.bind(this),
              }).render()
            : new Result({
                resultState: this.state,
                resetGroup: this.resetGroup.bind(this),
                returnToSelectCount: this.returnToSelectCount.bind(this),
              }).render()}
        </main>
      </div>`;
  }

  createOptimizedGroup(groupCnt) {
    const data = {
      records: getRecords().map(({ record }) => record),
      groupNum: groupCnt,
      peopleArr: getActiveMembers().map(member => member.id),
      forbiddenPairs: [],
    };
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
  }
}
