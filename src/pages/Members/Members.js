import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/Modals/DeleteModal.js';
import MemberList from './MemberList.js';
import {
  getMemberIdByName,
  checkDuplicatedName,
  checkActiveMember,
  checkMemberIncludedInRecords,
  addMember,
  updateMember,
  inactiveMember,
  removeMember,
} from '../../state/index.js';
import style from './Members.module.css';

export default class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removeMemberId: null,
      editingMember: {
        id: null,
        name: null,
      },
      isModalOpen: false,
    };
  }

  DOMStr() {
    // prettier-ignore
    return `
      <div class="mainContainer">
        ${new MainLayout().render()}
        <main class="main">
          <h2 class="title">Manage Members</h2>
          <pre class="${
            style.guide
          }">Double-click name to edit. When you are done, press Enter.</pre>
          ${new MemberList({
            editingMember: this.state.editingMember,
            toggleEditMode: this.toggleEditMode.bind(this),
            onUpdate: this.onUpdate.bind(this),
            openModal: this.openModal.bind(this),
          }).render()}
          <form class="${style.addMemberForm}">
            <input type="text" maxlength="20" autofocus=${true}/>
            <button type="submit">Add member</button>
          </form>
        </main>
        ${this.state.isModalOpen
            ? new DeleteModal({
                target: 'member',
                onRemove: this.onRemove.bind(this),
                closeModal: this.closeModal.bind(this),
              }).render()
            : ''}
      </div>`;
  }

  toggleEditMode(editingMember) {
    this.setState(prevState => ({
      ...prevState,
      editingMember,
    }));
  }

  preventDuplicatedName(name, callback) {
    if (!checkDuplicatedName(name)) {
      callback();
      return;
    }

    const id = getMemberIdByName(name);

    if (checkActiveMember(id)) {
      alert('Duplicate name is not allowed.');
      return;
    }

    if (checkMemberIncludedInRecords(id)) {
      alert('The name exists in Previous Records is not allowed.');
      return;
    }

    removeMember(id);
    callback();
  }

  onAdd(name) {
    this.preventDuplicatedName(name, () => addMember(name));
    document.getElementById('memberList').scroll({ top: 9999, behavior: 'smooth' });
  }

  onUpdate({ id, name }) {
    this.preventDuplicatedName(name, () => updateMember({ id, name }));
  }

  onRemove() {
    inactiveMember(this.state.removeMemberId);
  }

  openModal(removeMemberId) {
    this.setState(prevState => ({ ...prevState, isModalOpen: true, removeMemberId }));
  }

  closeModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: false, removeMemberId: null }));
  }

  setEvent() {
    return [
      // TODO: sanitize
      // TODO: 멤버 입력시 scrollable 요소의 bottom으로! 즉, 방금 추가된 멤버가 보이도록
      {
        type: 'submit',
        selector: `.${style.addMemberForm}`,
        handler: e => {
          e.preventDefault();

          const trimmedValue = e.target.querySelector('input').value.trim();
          if (trimmedValue !== '') {
            this.onAdd(trimmedValue);
          }
        },
      },
    ];
  }
}
