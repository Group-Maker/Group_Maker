import { Component } from '../../../library/CBD/index.js';
import { getMemberNameById } from '../../state/index.js';
import style from './Groups.module.css';

export default class Groups extends Component {
  DOMStr() {
    const { result } = this.props;
    // prettier-ignore
    return `
      <div>
        ${result.map(result => `
          <div class="${style.dropContainer} ${style.group}">
            ${result.map(id => `
              <div class="${style.member}" data-list-id="${id}" draggable="true">
                ${getMemberNameById(id)}
              </div>`).join('')}
          </div>`).join('')}
      </div>`;
  }
}
