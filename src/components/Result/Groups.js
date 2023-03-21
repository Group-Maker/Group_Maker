import { Component } from '@@/CBD';
import { getMemberNameById } from '@/state';
import style from '@/pages/NewGroup/Result.module.css';

export class Groups extends Component {
  DOMStr() {
    const { groupArr } = this.props;
    // prettier-ignore
    return `
      <div class="${style.groups}">
        ${groupArr.map((group, i) => `
          <div class="dropzone ${style.group}" data-list-id="${i}">
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
