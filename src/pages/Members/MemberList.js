import { Component } from '../../../library/CBD/index.js';
import MemberItem from './MemberItem.js';
import { getActiveMembers } from '../../state/index.js';
import style from './Members.module.css';
import 'boxicons';

export default class MemberList extends Component {
  DOMStr() {
    const { openModal, onUpdate, toggleEditMode, editingMember } = this.props;

    // prettier-ignore
    return `
      <ul class="${style.list}">
        ${getActiveMembers()
          .map(member =>
            new MemberItem({
              member,
              editingMember,
              openModal,
              onUpdate,
              toggleEditMode,
            }).render()
          )
          .join('')}
        <li class="${style.listItem} ${editingMember.id === style.addBtn ? style.editing : ''}" >
          <div class="${style.view}">
            <button type="button" class="${style.addBtn}">
              <box-icon name='plus-circle' class="${style.icon}"></box-icon>
            </button>
          </div>
          <input type="text" class="${style.edit} addMember" />
        </li>
      </ul>`;
  }

  setEvent() {
    const { toggleEditMode, onAdd } = this.props;
    return [
      {
        type: 'click',
        selector: `.${style.addBtn}`,
        handler: e => {
          const $li = e.target.closest(`.${style.listItem}`);
          const id = style.addBtn;
          toggleEditMode({ id, name: null });

          $li.lastElementChild.setSelectionRange(0, -1);
          $li.lastElementChild.focus();
        },
      },
      {
        type: 'keyup',
        selector: `.${style.edit}.addMember`,
        handler: e => {
          if (e.key !== 'Enter') {
            return;
          }

          const name = e.target.value;
          onAdd(name);
        },
      },
    ];
  }
}
