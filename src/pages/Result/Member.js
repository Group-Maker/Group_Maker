import { Component } from '../../../library/CBD/index.js';
import style from './Member.module.css';

export default class Member extends Component {
  render() {
    console.log(this.props);
    const {
      organization: { members },
    } = this.props;

    // prettier-ignore
    return members.map(({ id, name }) => `
      <div class="${style.member}" data-list-id="${id}" draggable="true">${name}</div>
    `).join('');
  }
}
