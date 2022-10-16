import { Component } from '../../library/index.js';
import MainLayout from '../components/MainLayout.js';
import DeleteModal from '../components/modals/DeleteModal.js';
import style from './Members.module.css';

export default class Members extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
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
