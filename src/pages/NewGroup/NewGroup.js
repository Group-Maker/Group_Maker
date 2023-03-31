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
      isLoading: false,
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
                isLoading: this.state.isLoading,
                count: this.state.groupCnt,
                setGroupCnt: this.setGroupCnt.bind(this),
                createManualGroup: this.createManualGroup.bind(this),
                createOptimizedGroup: this.createOptimizedGroup.bind(this),
              }).render()
            : new Result({
                isLoading: this.state.isLoading,
                resultState: this.state,
                resetGroup: this.resetGroup.bind(this),
                returnToSelectCount: this.returnToSelectCount.bind(this),
              }).render()}
        </main>
      </div>`;
  }

  setGroupCnt(newGroupCnt) {
    this.setState({
      ...this.state,
      groupCnt: newGroupCnt,
    });
  }

  async createOptimizedGroup(groupCnt) {
    const data = {
      records: getRecords().map(({ record }) => record),
      groupNum: groupCnt,
      peopleArr: getActiveMembers().map(member => member.id),
      forbiddenPairs: [],
    };

    this.setState({
      ...this.state,
      isLoading: true,
    });

    const asyncSolver = () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(solver(data));
        }, 0);
      });

    const result = await asyncSolver();
    const { newRecord } = result;

    // const { newRecord } = solver(data);

    this.setState({
      isLoading: false,
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
