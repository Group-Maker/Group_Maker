import { Component } from '../../library/CBD/index.js';
import MainLayout from '../components/Nav/MainLayout.js';
import DeleteModal from '../components/modals/DeleteModal.js';
import style from './Members.module.css';

export default class Members extends Component {
  render() {
    return `
      ${this.props.organization.members.map(({ id, name }) => `<span>${id} / ${name}</span>`)}
      <button class="${style.btn}">X</button>
      <section class="openTarget ${style.modal} hidden">
        ${new DeleteModal({ target: 'member' }).render()}
      </section>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.btn}`,
        handler: () => {
          document.querySelector('.openTarget').classList.remove('hidden');
        },
      },
    ];
  }
}
