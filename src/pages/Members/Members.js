import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/modals/DeleteModal.js';
import MemberList from './MemberList.js';

import style from './Members.module.css';

export default class Members extends Component {
  constructor(props) {
    super(props);
    [this.state, this.setState] = this.useState({
      removeMemberId: null,
      editingMemberIds: [],
      isModalOpen: false,
    });
  }

  render() {
    const { isSignedIn, organization, signOutSetState } = this.props;
    const { members } = organization;
    // prettier-ignore
    return `
      ${new MainLayout({ isSignedIn, signOutSetState }).render()}
      <section class="${style.container}">
        <h2 class="${style.title}">Manage Members</h2>
        ${new MemberList( {
          members,
          editingMemberIds: this.state.editingMemberIds,
          toggleEditMode: this.toggleEditMode.bind( this ),
          onAdd: this.onAdd.bind(this),
          onUpdate: this.onUpdate.bind(this),
          openModal: this.openModal.bind( this )
        } ).render()}
        <pre class="${style.guide}">Double click & press Enter to edit name</pre>
      </section>
        ${
          this.state.isModalOpen
            ? new DeleteModal({
              target: 'member',
              onRemove: this.onRemove.bind(this),
              closeModal: this.closeModal.bind(this),
            }).render()
          : ''
        }
    `;
  }

  isDuplicated(name) {
    console.log(this.props.organization.members);
    return this.props.organization.members.find(member => member.name === name) !== undefined;
  }

  toggleEditMode(id) {
    this.setState(prevState => ({
      ...prevState,
      editingMemberIds: [...prevState.editingMemberIds, id],
    }));
  }

  onAdd({ id, name }) {
    if (this.isDuplicated(name)) {
      alert('중복금지!중복금지!!');
      return;
    }

    this.props.addMember(name);
    this.setState(prevState => ({
      ...prevState,
      editingMemberIds: prevState.editingMemberIds.filter(_id => _id !== id),
    }));
    console.log(this.state.editingMemberIds);
  }

  onUpdate({ id, name }) {
    if (this.isDuplicated(name)) {
      alert('중복금지!중복금지!!');
      console.log(123);
      return;
    }

    this.props.updateMember({ id, name });
    this.setState(prevState => ({
      ...prevState,
      editingMemberIds: prevState.editingMemberIds.filter(_id => _id !== id),
    }));
  }

  onRemove() {
    this.props.removeMember(this.state.removeMemberId);
    this.closeModal();
  }

  openModal(removeMemberId) {
    this.setState(prevState => ({ ...prevState, isModalOpen: true, removeMemberId }));
  }

  closeModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: false, removeMemberId: null }));
  }
}
