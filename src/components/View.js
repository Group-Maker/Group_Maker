import { Component } from '../library/index.js';
import style from './View.module.css';
import Modal from './Modal.js';

export default class View extends Component {
  render() {
    return `
      <div class="${style.modal}">
        <div class="${style.overlay}"></div>
        <div class="${style.content}">${new Modal(this.props).render()}</div>
      </div>
    `;
  }
}
