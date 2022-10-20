import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import { getActiveMembersLength } from '../../state/index.js';
import style from './NewGroup.module.css';

export default class SelectGroupCnt extends Component {
  constructor(props) {
    super(props);

    this.memberCnt = getActiveMembersLength();
    this.groupCounter = new Counter({ ...this.props, minCount: 1, maxCount: this.memberCnt });
  }

  // prettier-ignore
  DOMStr ()
  {
    const noMember = this.memberCnt === 0;
    return `
      <div>
        <h2 class="title">Make New Group</h2>
        <p class=${this.memberCnt ? '' : style.errorMsg}>Current member count: ${this.memberCnt}</p>
        <p>${noMember ? 'Create member before make group!' : 'How many groups do you want?'}</p>
        ${this.groupCounter.render()}
        <button class="manualGroupBtn" ${noMember ? 'disabled' : ''}>MANUALLY<br>CREATE GROUPS</button>
        <button class="optimizedGroupBtn" ${noMember ? 'disabled' : ''}>CREATE<br>OPTIMIZED GROUPS</button>
      </div>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.optimizedGroupBtn',
        handler: () => this.props.createOptimizedGroup(this.groupCounter.getCount()),
      },
      {
        type: 'click',
        selector: '.manualGroupBtn',
        handler: () => this.props.createManualGroup(this.groupCounter.getCount()),
      },
    ];
  }
}
