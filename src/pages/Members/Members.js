import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/modals/DeleteModal.js';
import style from './Members.module.css';

export default class Members extends Component {
  render() {
    const { isSignedIn, organization, signOutSetState } = this.props;

    return `
    <div class="mainContainer">
      ${new MainLayout({ isSignedIn, signOutSetState }).render()}
      <main class="main">
        <h2>MEMBERS!!</h2>
        ${organization.members.map(({ id, name }) => `<span>${id} / ${name}</span>`)}
        <button class="${style.btn}">X</button>
        <section class="modal hidden">
          ${new DeleteModal({ target: 'member' }).render()}
        </section>
      </main>
    </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.btn}`,
        handler: () => {
          document.querySelector('.modal').classList.remove('hidden');
        },
      },
    ];
  }
}
