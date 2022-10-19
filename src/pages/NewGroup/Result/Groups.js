import { Component } from '../../../../library/CBD/index.js';
import style from './Groups.module.css';

export default class Groups extends Component {
  render() {
    const { organization, result } = this.props;

    console.log(organization, result);
    // prettier-ignore
    return result.map(result => `
      <div class="${style.dropContainer} ${style.group}">${
        result.map(id => `
        <div class="${style.member}" data-list-id="${id}" draggable="true">
          ${organization.members.find(member => member.id === id).name}
        </div>
      `).join('')
        }
      </div>
    `).join('');
  }
}
