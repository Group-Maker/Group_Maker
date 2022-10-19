import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import Result from './Result.js';
import SelectGroupCnt from './SelectGroupCnt.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      currentView: 'selectGroupCnt',
    };
  }

  render() {
    return `
      ${new MainLayout().render()}
      <div class="mainContainer">
        ${
          this.resultState.currentView === 'selectGroupCnt'
            ? new SelectGroupCnt({ setState: this.setState.bind(this) }).render()
            : new Result({ resultState: this.state }).render()
        }
      </div>
    `;
  }
}
