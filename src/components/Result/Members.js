import { Component } from '../../../library/CBD/index.js';
import { getActiveMembers } from '../../state/index.js';
import style from '../../pages/NewGroup/Result.module.css';

export default class Members extends Component {
  DOMStr() {
    // prettier-ignore
    return `
    <li class="${style.memberList}">
      ${getActiveMembers().map(({ id, name }) => `
        <div class="${style.member}" data-list-id="${id}" draggable="true">${name}</div>`).join('')}
    </li>`;
  }
}
