import { Component } from '../../library/CBD/index.js';
import MainLayout from '../components/Nav/MainLayout.js';
import DeleteModal from '../components/modals/DeleteModal.js';
import style from './Records.module.css';
// import style from './Records.module.css';
// import View from '../component/View.js';

export default class Records extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
      RECORDS!!
      ${this.props.organization.records.map(record => `<span>${record}</span>`)}
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
