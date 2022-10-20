import { Component } from '../../../library/CBD/index.js';
import Counter from '../../components/Counter/Counter.js';
import { getMembersLength } from '../../state/index.js';
import style from './NewGroup.module.css';

export default class SelectGroupCnt extends Component {
  constructor(props) {
    super(props);

    this.memberCnt = getMembersLength();
    this.groupCounter = new Counter({ ...this.props, minCount: 1, maxCount: this.memberCnt });
  }

  // prettier-ignore
  DOMStr ()
  {
    const noMember = getMembersLength() === 0;
    return `
      <div>
        <h2 class="title">Make New Group</h2>
        <p class=${this.memberCnt ? '' : style.errorMsg}>Current member count: ${this.memberCnt} ${noMember ? '<br/>Create member before make group!' : ''}</p>
        <p>How many groups do you want?</p>
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
