import { Component } from '@@/CBD';
import { Link } from '@@/SPA-router';
import { ROUTE_PATH } from '@/constants';
import style from './Modal.module.css';

export class SignupModal extends Component {
  DOMStr() {
    // prettier-ignore
    return `
      <section class="modal">
        <div class="closeTarget ${style.overlay}"></div>
        <div class="${style.content}">
          <div class="${style.message}">Congratulation!<br> Now you can Sign in</div>
          <div class="${style.buttons}">
            ${new Link({ path: ROUTE_PATH.signin, classNames: [style.button], content: 'Sign in' }).render()}
          </div>
        </div>
      </section>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.closeTarget',
        handler: this.props.closeModal,
      },
    ];
  }
}
