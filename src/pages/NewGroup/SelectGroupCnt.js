import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import { getActiveMembersLength } from '../../state/index.js';
import style from './NewGroup.module.css';

export default class SelectGroupCnt extends Component {
  constructor(props) {
    super(props);

    this.memberCnt = getActiveMembersLength();
    this.groupCounter = new Counter({ minCount: 1, maxCount: this.memberCnt });
  }

  // prettier-ignore
  DOMStr ()
  {
    const noMember = this.memberCnt === 0;
    return `
      <div class="test ${style.container}">
        <h2 class="title">Make New Group</h2>
        <div class="${style.innerContainer}">
          <p class="${style.msg} ${this.memberCnt ? '' : style.errorMsg}">There are currently ${
      this.memberCnt
    } members.<br>${noMember ? 'Create member before make group!' : 'How many groups do you want?'}</p>
          ${this.groupCounter.render()}
          <div class="${style.btnContainer}">
            <button class="${style.manualGroupBtn}" ${noMember ? 'disabled' : ''}>MANUALLY<br>CREATE GROUPS</button>
            <button class="${style.optimizedGroupBtn}" ${noMember ? 'disabled' : ''}>CREATE<br>OPTIMIZED GROUPS</button>
          </div>
        </div>
      </div>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.optimizedGroupBtn}`,
        handler: () => this.props.createOptimizedGroup(this.groupCounter.getCount()),
      },
      {
        type: 'click',
        selector: `.${style.manualGroupBtn}`,
        handler: () => this.props.createManualGroup(this.groupCounter.getCount()),
      },
    ];
  }
}
