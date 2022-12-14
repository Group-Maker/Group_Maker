import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/Modals/DeleteModal.js';
import { addMember, isDuplicatedMemberName, removeMember, updateMember } from '../../state/index.js';
import MemberList from './MemberList.js';

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
        <pre class="${style.guide}">Double click & press Enter to edit name</pre>
        ${new MemberList({
          editingMember: this.state.editingMember,
          toggleEditMode: this.toggleEditMode.bind(this),
          onAdd: this.onAdd.bind(this),
          onUpdate: this.onUpdate.bind(this),
          openModal: this.openModal.bind(this),
        }).render()}
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

  onAdd(name) {
    if (name.trim() === '') {
      this.toggleEditMode({ id: null, name: null });
      return;
    }

    if (isDuplicatedMemberName(name)) {
      alert('중복금지!중복금지!!');
      return;
    }
    addMember(name);
  }

  onUpdate({ id, name }) {
    if (name.trim() === '') {
      this.toggleEditMode({ id: null, name: null });
      return;
    }

    if (isDuplicatedMemberName(name)) {
      alert('중복금지!중복금지!!');
      return;
    }

    updateMember({ id, name });
  }

  onRemove() {
    removeMember(this.state.removeMemberId);
  }

  openModal(removeMemberId) {
    this.setState(prevState => ({ ...prevState, isModalOpen: true, removeMemberId }));
  }

  closeModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: false, removeMemberId: null }));
  }
}
