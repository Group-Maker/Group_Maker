import { Component } from '../library/index.js';
// import MainLayout from '../components/MainLayout.js';
import style from './Records.module.css';
import View from '../component/View.js';

export default class Records extends Component {
  render() {
    // prettier-ignore
    return `
      <button class="${style.deleteButton}">delete</button>
      <div class="modal" hidden>${new View({
        className: ['back', 'back'],
        contents: ['CANCEL', 'DELETE'],
        message: 'ARE YOU SURE? This record will be deleted permanently!',
      }).render()}
      </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `${style.deleteButton}`,
        handler: e => {
          e.target.nextElementSibling.removeAttribute('hidden');
        },
      },
    ];
  }
}
