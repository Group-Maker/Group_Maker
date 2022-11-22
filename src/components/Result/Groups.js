import { Component } from '../../../library/CBD/index.js';
import { getMemberNameById } from '../../state/index.js';
import style from '../../pages/NewGroup/Result.module.css';

export default class Groups extends Component {
  DOMStr() {
    const { result } = this.props;
    // prettier-ignore
    return `
      <div>
        ${result.map((group, i) => `
          <div class="dropzone ${style.group}" data-list-id="${i}" draggable="true">
            <ul class="${style.memberList}">
            ${group.map(id => `
              <li class="draggable ${style.member}" data-list-id="${id}" draggable="true">
                ${getMemberNameById(id)}
              </li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>`;
  }
}
