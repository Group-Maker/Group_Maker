import { Component } from '../../../library/CBD/index.js';
import { getMemberNameById } from '../../state/index.js';
import style from '../../pages/NewGroup/Result.module.css';

export default class Groups extends Component {
  DOMStr() {
    const { result } = this.props;
    // prettier-ignore
    return `
      <div>
        ${result.map(group => `
          <div class="${style.dropContainer} ${style.group}">
            ${group.map(id => `
              <div class="${style.member}" data-list-id="${id}" draggable="true">
                ${getMemberNameById(id)}
              </div>`).join('')}
          </div>`).join('')}
      </div>`;
  }
}
