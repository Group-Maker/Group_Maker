import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import Result from './Result.js';
import SelectGroupCnt from './SelectGroupCnt.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);
    [this.state, this.setState] = this.useState({ result: null });
  }

  render() {
    return `
      ${new MainLayout().render()}
      <div class="mainContainer">
        ${this.state.result ? new Result(this.state.result).render() : new SelectGroupCnt(this.setState).render()}
      </div>
    `;
  }
}
