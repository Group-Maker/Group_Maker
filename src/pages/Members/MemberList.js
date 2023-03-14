import { Component } from '../../../library/CBD/index.js';
import MemberItem from './MemberItem.js';
import { getActiveMembers } from '../../state/index.js';
import style from './Members.module.css';
import 'boxicons';

export default class MemberList extends Component {
  didMount() {
    const $addMemberInput = document.getElementById('addMemberInput');
    $addMemberInput?.focus();
    $addMemberInput?.setSelectionRange(21, 21);
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
