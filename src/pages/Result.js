import { Component } from '../../library/CBD/index.js';
import MainLayout from '../components/MainLayout/MainLayout.js';
import SaveModal from '../components/modals/SaveModal.js';
import style from './Result.module.css';

export default class Result extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
      <button class="${style.btn}">SAVE</button>
      <section class="modal hidden">
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
          document.querySelector('.modal').classList.remove('hidden');
        },
      },
    ];
  }
}
