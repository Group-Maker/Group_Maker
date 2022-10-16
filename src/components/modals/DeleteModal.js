import { Component } from '../../../library/CBD/index.js';
import style from './Modal.module.css';

export default class DeleteModal extends Component {
  render() {
    const { target } = this.props;
    // prettier-ignore
    return `
      <div class="closeTarget ${style.overlay} "></div>
      <div class="${style.content}">
        <div class="${style.message}">
        <div>ARE YOU SURE?</div>
          This ${target} will be\n
          deleted permanently!
        </div>
        <div class="${style.buttons}">
          <button class="closeTarget ${style.button}">CANCEL</button>
          <button class="closeTarget ${style.button} ${style.warning}">DELETE</button>
        </div>
      </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.closeTarget',
        handler: e => {
          e.target.closest('.modal').classList.add('hidden');
        },
      },
    ];
  }
}
