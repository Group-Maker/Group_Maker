import { Component } from '../../../library/CBD/index.js';
import { getMembers } from '../../state/index.js';
import style from './Members.module.css';

export default class Members extends Component {
  DOMStr() {
    // prettier-ignore
    return `
    <div>
      ${getMembers().map(({ id, name }) => `
        <div class="${style.member}" data-list-id="${id}" draggable="true">${name}</div>`).join('')}
    </div>`;
  }
}
