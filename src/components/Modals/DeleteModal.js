import { Component } from '../../../library/CBD/index.js';
import style from './Modal.module.css';

export default class DeleteModal extends Component {
  DOMStr() {
    const { target } = this.props;
    // prettier-ignore
    return `
      <section class="modal">
        <div class="closeTarget ${style.overlay} "></div>
        <div class="${style.content}">
          <div class="${style.message}">
          <div class="${style.alertMessage}">ARE YOU SURE?</div>
            This ${target} will be<br>deleted permanently!
          </div>
          <div class="${style.buttons}">
            <button class="closeTarget ${style.button}">CANCEL</button>
            <button class="removeBtn ${style.button} ${style.warning}">DELETE</button>
          </div>
        </div>
      </section>`;
  }

  setEvent() {
    const { onRemove, closeModal } = this.props;
    return [
      {
        type: 'click',
        selector: '.modal .closeTarget',
        handler: closeModal,
      },
      {
        type: 'click',
        selector: `.removeBtn.${style.button}`,
        handler: onRemove,
      },
    ];
  }
}
