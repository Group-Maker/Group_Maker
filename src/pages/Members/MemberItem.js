import { Component } from '../../../library/CBD/index.js';
import style from './Members.module.css';

export default class MemberItem extends Component {
  DOMStr() {
    const { member, editingMember } = this.props;
    const { id, name } = member;
    const isEditing = editingMember.id === id;

    return `
      <li class="${style.listItem} ${isEditing ? style.editing : ''}" data-id="${id}" data-name="${name}">
        <div class="${style.view}">
          <span class="${style.name}">${name}</span>
          <button type="button" class="${style.removeBtn}">X</button>
        </div>
        <input type="text" value="${name}" class="${style.edit}" data-id="${id}" />
      </li>`;
  }

  setEvent() {
    const { openModal, onUpdate, toggleEditMode, editingMember } = this.props;
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
          const { id, name } = $li.dataset;
          toggleEditMode({ id: +id, name });

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
          console.log(id, name, editingMember);
          if (editingMember.id === id && editingMember.name === name) {
            toggleEditMode({ id: null, name: null });
            return;
          }

          onUpdate({ id, name });
        },
      },
    ];
  }
}
