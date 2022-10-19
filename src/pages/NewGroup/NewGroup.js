import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import Result from './Result.js';
import SelectGroupCnt from './SelectGroupCnt.js';

export default class NewGroup extends Component {
  constructor(props) {
    super(props);
    // [this.state, this.setState] = this.useState({ isCreateGroupMode: false, result: [] });
    [this.state, this.setState] = this.useState({ result: null });
  }

  render() {
    const { isSignedIn, signOutSetState } = this.props;

    return `
      ${new MainLayout({ isSignedIn, signOutSetState }).render()}
      <div class="mainContainer">
        ${
          this.state.result
            ? new Result(this.props, this.state.result).render()
            : new SelectGroupCnt(this.props, this.setState).render()
        }
      </div>
    `;
  }
}
