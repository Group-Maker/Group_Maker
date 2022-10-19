import { Component } from '../../../library/CBD/index.js';
import style from './Records.module.css';

export default class RecordItem extends Component {
  render() {
    const { id, record, recordOrder } = this.props;
    // prettier-ignore

    return `
      <li class="${style.recordItem}" data-id="${id}">
        <h3 class="${style.recordTitle}">Record ${recordOrder}</h3>
        ${record.map( ( group, groupOrder ) => `
          <ul class="${style.groupList}">
            <h4 class="${style.groupTitle}">Group ${groupOrder + 1}</h4>
            ${group.filter( member => member !== null ).map( memberId => `
              <li class="${style.groupItem}">
                <span>${this.getMemberName(memberId)}</span>
              </li>
            `).join( '' )}
          </ul>
        `).join( '' )}
        <button type="button" class="${style.removeBtn}">X</button>
      </li>
    `;
  }

  getMemberName(id) {
    return this.props.members.find(member => member.id === id).name;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.removeBtn}`,
        handler: e => {
          const id = +e.target.closest(`.${style.recordItem}`).dataset.id;
          this.props.openModal(id);
        },
      },
    ];
  }
}
