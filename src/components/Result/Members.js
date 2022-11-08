import { Component } from '../../../library/CBD/index.js';
import { getActiveMembers } from '../../state/index.js';
import style from '../../pages/NewGroup/Result.module.css';

export default class Members extends Component {
  DOMStr() {
    // prettier-ignore
    return `
    <ul class="dropzone ${style.memberList}">
      ${getActiveMembers().map(({ id, name }) => `
        <li class="draggable ${style.member}" data-list-id="${id}" draggable="true">${name}</li>`).join('')}
    </ul>`
  }
}
