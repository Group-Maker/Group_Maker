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

  async preventDuplicatedName(name, callback) {
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

    const uid = getUID();
    try {
      if (uid) {
        await deleteMemberOnServer(uid, id);
      } else {
        deleteMemberOnLocal(id);
      }
      removeMember(id);
    } catch (err) {
      console.log('remove faild', err);
      // 토스트 띄워줘야 함
    }

    callback();
  }

  async onAdd(name) {
    if (getActiveMembers().length >= 50) {
      alert('You have reached the maximum number of members.');
      return;
    }
    await this.preventDuplicatedName(name, async () => {
      const uid = getUID();
      addMember(name);
      const member = getMemberByName(name);
      try {
        if (uid) {
          await addMemberOnServer(uid, member);
        } else {
          addMemberOnLocal(member);
        }
      } catch (err) {
        console.log('add faild', err);
        // 토스트 띄워줘야 함
        removeMember(member.id);
      }
    });
    document.getElementById('memberList').scroll({ top: 9999, behavior: 'smooth' });
  }

  async onUpdate({ id, name }) {
    await this.preventDuplicatedName(name, async () => {
      const uid = getUID();
      const originalMember = getMemberById(id);
      const updatedMember = { ...originalMember, id, name };
      updateMember(updatedMember);
      try {
        if (uid) {
          await updateMemberOnServer(uid, updatedMember);
        } else {
          updateMemberOnLocal(updatedMember);
        }
      } catch (err) {
        console.log('update faild', err);
        // 토스트 띄워줘야 함
        updateMember(originalMember);
      }
    });
  }

  async onRemove() {
    const { removeMemberId } = this.state;
    inactivateMember(removeMemberId);

    const uid = getUID();
    const member = getMemberById(removeMemberId);
    try {
      if (uid) {
        await updateMemberOnServer(uid, member);
      } else {
        updateMemberOnLocal(member);
      }
    } catch (err) {
      console.log('remove faild', err);
      // 토스트 띄워줘야 함
      activateMember(removeMemberId);
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
