import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import Result from './Result.js';
import SelectGroupCnt from './SelectGroupCnt.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);

    [this.resultState, this.setState] = this.useState({
      result: null,
      currentView: 'selectGroupCnt',
    });
  }

  render() {
    // prettier-ignore
    return `
    <div class="mainContainer">
      ${new MainLayout().render()}
      <main class="main">
        ${this.resultState.currentView === 'selectGroupCnt'
          ? new SelectGroupCnt({ setState: this.setState }).render()
          : new Result({ resultState: this.resultState }).render()}
      </main>
    </div>
    `;
  }
}
