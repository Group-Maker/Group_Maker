import { Component } from '@@/CBD';
import { MainLayout, DeleteModal } from '@/components';
import { MemberList } from './MemberList';
import {
  getMemberById,
  getMemberByName,
  getUID,
  getActiveMembers,
  getMemberIdByName,
  checkDuplicatedName,
  checkActiveMember,
  checkMemberIncludedInRecords,
  addMember,
  updateMember,
  inactivateMember,
  removeMember,
  activateMember,
} from '@/state';
import {
  addMemberOnLocal,
  addMemberOnServer,
  updateMemberOnLocal,
  updateMemberOnServer,
  deleteMemberOnLocal,
  deleteMemberOnServer,
} from '@/apis';
import style from './Members.module.css';

export class Members extends Component {
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
          <h2 class="title">MANAGE MEMBERS</h2>
          <div class="${style.innerContainer}">
            <pre class="${style.guide}">Double-click name to edit.</pre>
            ${new MemberList({
              editingMember: this.state.editingMember,
              toggleEditMode: this.toggleEditMode.bind(this),
              onUpdate: this.onUpdate.bind(this),
              openModal: this.openModal.bind(this),
            }).render()}
            <form class="${style.addMemberForm}">
              <input id="addMemberInput" type="text" maxlength="20" />
              <button type="submit">Add member</button>
            </form>
          </div>
        </main>
        ${
          this.state.isModalOpen
            ? new DeleteModal({
                target: 'member',
                onRemove: this.onRemove.bind(this),
                closeModal: this.closeModal.bind(this),
              }).render()
            : ''
        }
      </div>`;
  }

  toggleEditMode(editingMember) {
    this.setState(prevState => ({
      ...prevState,
      editingMember,
    }));
  }

  async preventDuplicatedName(name) {
    if (!checkDuplicatedName(name)) {
      return;
    }

    const id = getMemberIdByName(name);

    if (checkActiveMember(id)) {
      throw new Error('Duplicate name is not allowed.');
    }

    if (checkMemberIncludedInRecords(id)) {
      throw new Error('The name exists in Previous Records is not allowed.');
    }

    const uid = getUID();
    try {
      uid ? await deleteMemberOnServer(uid, id) : deleteMemberOnLocal(id);
      removeMember(id);
    } catch (err) {
      console.log('Delete duplicated name error');
      throw new Error('Network Error. Please check network connection');
    }
  }

  async onAdd(name) {
    let member;

    try {
      if (getActiveMembers().length >= 50) {
        throw new Error('You have reached the maximum number of members.');
      }
      await this.preventDuplicatedName(name);

      addMember(name);

      const uid = getUID();
      member = getMemberByName(name);

      uid ? await addMemberOnServer(uid, member) : addMemberOnLocal(member);
    } catch (err) {
      console.error('add faild', err);
      // 토스트 띄워줘야 함
      alert(err.message);
      member && removeMember(member.id);
    }
    document.getElementById('memberList').scroll({ top: 9999, behavior: 'smooth' });
  }

  async onUpdate({ id, name }) {
    const originalMember = getMemberById(id);

    try {
      await this.preventDuplicatedName(name);

      const uid = getUID();
      const updatedMember = { ...originalMember, id, name };

      updateMember(updatedMember);

      if (uid) {
        await updateMemberOnServer(uid, updatedMember);
      } else {
        updateMemberOnLocal(updatedMember);
      }
    } catch (err) {
      console.error('update faild', err);
      // 토스트 띄워줘야 함
      alert(err.message);
      updateMember(originalMember);
    }
  }

  async onRemove() {
    const id = this.state.removeMemberId;

    try {
      inactivateMember(id);

      const uid = getUID();
      const member = getMemberById(id);
      const isIncludedInRecord = checkMemberIncludedInRecords(id);
      if (uid) {
        isIncludedInRecord ? await updateMemberOnServer(uid, member) : await deleteMemberOnServer(uid, id);
      } else {
        isIncludedInRecord ? updateMemberOnLocal(member) : deleteMemberOnLocal(id);
      }
    } catch (err) {
      console.error('remove faild', err);
      // 토스트 띄워줘야 함
      alert(err.message);
      activateMember(id);
    }
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
