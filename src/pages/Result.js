import { Component } from '../../library/CBD/index.js';
// import MainLayout from '../components/MainLayout.js';
import SaveModal from '../components/modals/SaveModal.js';
import style from './Result.module.css';

export default class Result extends Component {
  render() {
    return `
      <button class="${style.btn}">SAVE</button>
      <section class="openTarget ${style.modal} hidden">
        ${new SaveModal().render()}
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
