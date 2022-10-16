import { Component } from '../../../library/CBD/index.js';
import style from './Modal.module.css';
import Link from '../../../library/SPA-router/index.js';

export default class SaveModal extends Component {
  render() {
    // prettier-ignore
    return `
      <div class="${style.overlay}"></div>
      <div class="${style.content}">
        <div class="${style.message}">Store Records!</div>
        <div class="${style.buttons}">
          ${new Link({ path: '/records', classNames: [style.button], content: '모든 기록 보기' }).render()}
          ${new Link({ path: '/newgroup', classNames: [style.button], content: '조 더 짜기!' }).render()}
        </div>
      </div>
    `;
  }
}
