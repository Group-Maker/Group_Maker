import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/modals/DeleteModal.js';
import style from './Records.module.css';

export default class Records extends Component {
  render() {
    return `
    <div class="mainContainer">
      ${new MainLayout(this.props).render()}
      <main class="main">
        <h2>RECORDS!!</h2>
        ${this.props.organization.records.map(record => `<span>${record}</span>`)}
        <button class="${style.btn}">X</button>
        <section class="modal hidden">
          ${new DeleteModal({ target: 'record' }).render()}
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
