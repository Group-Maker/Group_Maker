import { Component } from '../../../library/CBD/index.js';
import MemberItem from './MemberItem.js';
import style from './Members.module.css';
import 'boxicons';
import { getMembers } from '../../state/index.js';

export default class MemberList extends Component {
  render() {
    const { openModal, onUpdate, toggleEditMode } = this.props;

    // prettier-ignore
    return `
      <ul class="${style.list}">
        ${getMembers()
          .map(member =>
            new MemberItem({
              isEditing: this.isEditing(member.id),
              openModal,
              onUpdate,
              toggleEditMode,
            }).render()
          )
          .join('')}
        <li class="${style.listItem} ${this.isEditing(style.addBtn) ? style.editing : ''}" >
          <div class="${style.view}">
            <button type="button" class="${style.addBtn}">
              <box-icon name='plus-circle' class="${style.icon}" ></box-icon>
            </button>
          </div>
          <input type="text" class="${style.edit} addMember" />
        </li>
      </ul>
    `;
  }

  isEditing(id) {
    return this.props.editingMemberIds.includes(id);
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
          toggleEditMode(id);

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
          onAdd({ id: style.addBtn, name });
        },
      },
    ];
  }
}
