import { Component } from '@@/CBD';
import { MemberItem } from './MemberItem';
import { getActiveMembers } from '@/state';
import style from './Members.module.css';
import 'boxicons';

export class MemberList extends Component {
  didMount() {
    const $editMemberInput = document.getElementById('editMemberInput');
    $editMemberInput?.focus();
    $editMemberInput?.setSelectionRange(21, 21);
  }

  DOMStr() {
    const { editingMember, toggleEditMode, onUpdate, openModal } = this.props;

    // prettier-ignore
    return `
      <ul id="memberList" class="${style.list}">
        ${getActiveMembers()
          .map(member =>
            new MemberItem({
              member,
              editingMember,
              toggleEditMode,
              onUpdate,
              openModal,
            }).render()
          ).join('')}
      </ul>`;
  }
}
