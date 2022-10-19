import { Component } from '../../../library/CBD/index.js';
import style from './Members.module.css';

export default class MemberItem extends Component {
  render() {
    const { isEditing, member } = this.props;
    const { id, name } = member;

    return `
      <li class="${style.listItem} ${isEditing ? style.editing : ''}" data-id="${id}">
        <div class="${style.view}">
          <span class="${style.name}">${name}</span>
          <button type="button" class="${style.removeBtn}">X</button>
        </div>
        <input type="text" value="${name}" class="${style.edit}" data-id="${id}" />
      </li>
    `;
  }

  setEvent() {
    const { openModal, onUpdate, toggleEditMode } = this.props;
    return [
      {
        type: 'click',
        selector: `.${style.removeBtn}`,
        handler: e => {
          const id = +e.target.closest(`.${style.listItem}`).dataset.id;
          openModal(id);
        },
      },
      {
        type: 'dblclick',
        selector: `.${style.listItem}`,
        handler: e => {
          const $li = e.target.closest(`.${style.listItem}`);
          const id = +$li.dataset.id;
          toggleEditMode(id);

          $li.lastElementChild.setSelectionRange(0, -1);
          $li.lastElementChild.focus();
        },
      },
      {
        type: 'keyup',
        selector: `.${style.edit}[data-id="${this.props.member.id}"]`,
        handler: e => {
          if (e.key !== 'Enter') {
            return;
          }

          const id = +e.target.closest(`.${style.listItem}`).dataset.id;
          const name = e.target.value;
          onUpdate({ id, name });
        },
      },
    ];
  }
}
