import { Component } from '@@/CBD';
import { Counter } from '@/components';
import { getActiveMembers } from '@/state';
import { ONBOARDING_ID } from '@/constants';
import style from './NewGroup.module.css';

export class SelectGroupCnt extends Component {
  constructor(props) {
    super(props);

    this.memberCnt = getActiveMembers().length;
  }

  DOMStr() {
    const noMember = this.memberCnt === 0;

    // prettier-ignore
    return /* html */ `
      <div class="${style.container}">
        <h2 class="title">GENERATE OPTIMAL GROUPS</h2>
        <div class="${style.innerContainer}">
        ${
          this.props.isLoading
            ? /* html */ `<span class="${style.loadingMsg}">generating groups...</span>`
            : /* html */ `
            <p class="${style.msg} ${this.memberCnt ? '' : style.errorMsg}">There are currently ${
              this.memberCnt
            } members.<br>${noMember ? 'Create member before make group!' : 'How many groups do you want?'}</p>
            ${new Counter({ count: this.props.count, minCount: 1, maxCount: this.memberCnt }).render()}
            <div class="${style.btnContainer}">
              <button class="${style.optimizedGroupBtn}" ${noMember ? 'disabled' : ''} data-onboarding-id="${
                ONBOARDING_ID.OPTIMAL_GENERATE
              }">GENERATE</button>
              <button class="${style.manualGroupBtn}" ${
                noMember ? 'disabled' : ''
              }>Or you can generate groups manually</button>
            </div>`
        }
        </div>
      </div>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.optimizedGroupBtn}`,
        handler: () => this.props.createOptimizedGroup(this.props.count),
      },
      {
        type: 'click',
        selector: `.${style.manualGroupBtn}`,
        handler: () => this.props.createManualGroup(this.props.count),
      },
    ];
  }
}
