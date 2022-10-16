import { Component } from '../../library/index.js';
// import MainLayout from '../components/MainLayout.js';
import DeleteModal from '../components/modals/DeleteModal.js';
import style from './Records.module.css';

export default class Records extends Component {
  render() {
    return `
      <button class="${style.btn}">X</button>
      <section class="openTarget ${style.modal} hidden">
        ${new DeleteModal({ target: 'record' }).render()}
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
