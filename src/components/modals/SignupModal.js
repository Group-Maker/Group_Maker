import { Component } from '../../../library/index.js';
import style from './Modal.module.css';
import Button from '../Button.js';

export default class SignupModal extends Component {
  render() {
    // prettier-ignore
    return `
      <div class="${style.overlay}"></div>
      <div class="${style.content}">
        <div class="${style.message}">Congratulation!\n Now you can Sign in</div>
        <div class="${style.buttons}">
          ${new Button({ path: '/signin', className: `${style.btn}`, content: 'Sign in' }).render()}
        </div>
      </div>
    `;
  }
}
