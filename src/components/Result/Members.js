import { Component } from '../../../library/CBD/index.js';
import { getActiveMembers } from '../../state/index.js';
import style from './Members.module.css';

export default class Members extends Component {
  DOMStr() {
    // prettier-ignore
    return `
    <div>
      ${getActiveMembers().map(({ id, name }) => `
        <div class="${style.member}" data-list-id="${id}" draggable="true">${name}</div>`).join('')}
    </div>`;
  }
}
