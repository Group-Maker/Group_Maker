import { Component } from '@@/CBD';
import { getMemberNameById } from '@/state';
import style from '@/pages/NewGroup/Result.module.css';

export class Members extends Component {
  DOMStr() {
    const { memberArr } = this.props;
    // prettier-ignore
    return `
    <ul class="${style.memberList}">
    ${memberArr.map(id => `
      <li class="draggable ${style.member}" data-list-id="${id}" draggable="true">
        ${getMemberNameById(id)}
      </li>`).join('')}
    </ul>`
  }
}
