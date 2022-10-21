import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import style from './Modal.module.css';

export default class SaveModal extends Component {
  DOMStr() {
    console.log('modalsave');
    // prettier-ignore
    return `
      <div class="modal">
        <div class="closeTarget ${style.overlay}"></div>
        <div class="${style.content}">
          <div class="${style.message}">Store Records!</div>
          <div class="${style.buttons}">
            ${new Link({ path: '/records', classNames: [style.button], content: '모든 기록 보기' }).render()}
            <button type="button" class="${style.button}">Make more Group!</button>
          </div>
        </div>
      </div>`;
  }

  setEvent() {
    const { closeModal, returnToSelectCount } = this.props;
    return [
      {
        type: 'click',
        selector: '.closeTarget',
        handler: closeModal,
      },
      {
        type: 'click',
        selector: `button.${style.button}`,
        handler: returnToSelectCount,
      },
    ];
  }
}
