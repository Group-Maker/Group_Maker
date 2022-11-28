import { Component } from '../../../library/CBD/index.js';
import { getMemberNameById } from '../../state/index.js';
import style from '../../pages/NewGroup/Result.module.css';

export default class Members extends Component {
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
