import { Component } from '../../../library/index.js';
import style from './Modal.module.css';
import Button from '../Button.js';

export default class SaveModal extends Component {
  render() {
    // prettier-ignore
    return `
      <div class="${style.overlay}"></div>
      <div class="${style.content}">
        <div class="${style.message}">Store Records!</div>
        <div class="${style.buttons}">
          ${new Button({ path: '/records', className: `${style.btn}`, content: '모든 기록 보기' }).render()}
          ${new Button({ path: '/newgroup', className: `${style.btn}`, content: '조 더 짜기!' }).render()}
        </div>
      </div>
    `;
  }
}
