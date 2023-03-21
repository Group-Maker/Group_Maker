import { Component } from '@@/CBD';
import { getMemberNameById } from '@/state';
import style from './Records.module.css';

export class RecordItem extends Component {
  DOMStr() {
    const { id, record, recordOrder } = this.props;

    // prettier-ignore
    return `
      <li class="${style.recordItem}" data-id="${id}">
        <h3 class="${style.recordTitle}">Record ${recordOrder}</h3>
        ${record.map((group, groupOrder) => `
          <ul class="${style.groupList}">
            <h4 class="${style.groupTitle}">Group ${groupOrder + 1}</h4>
            <div class="${style.memberList}">
              ${group
              .filter(member => member !== null)
              .map(memberId => `
              <li class="${style.memberItem}">
                <span>${getMemberNameById(memberId)}</span>
              </li>`).join('')}
            </div>
          </ul>`).join('')}
        <button aria-label="delete record" class="${style.removeBtn}">
          <?xml version="1.0" encoding="utf-8"?>
          <svg fill="#FFFFFF" width="26px" height="26px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,23A11,11,0,1,0,1,12,11.013,11.013,0,0,0,12,23ZM12,3a9,9,0,1,1-9,9A9.01,9.01,0,0,1,12,3ZM8.293,14.293,10.586,12,8.293,9.707A1,1,0,0,1,9.707,8.293L12,10.586l2.293-2.293a1,1,0,0,1,1.414,1.414L13.414,12l2.293,2.293a1,1,0,1,1-1.414,1.414L12,13.414,9.707,15.707a1,1,0,0,1-1.414-1.414Z"/>
          </svg>
        </button>
      </li>`;
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
