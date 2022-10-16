import { Component } from '../../../library/CBD/index.js';
import style from './Modal.module.css';
import Link from '../../../library/SPA-router/index.js';

export default class SignupModal extends Component {
  render() {
    // prettier-ignore
    return `
      <div class="${style.overlay}"></div>
      <div class="${style.content}">
        <div class="${style.message}">Congratulation!\n Now you can Sign in</div>
        <div class="${style.buttons}">
          ${new Link({ path: '/signin', classNames: [style.button], content: 'Sign in' }).render()}
        </div>
      </div>
    `;
  }
}
