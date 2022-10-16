import { Component } from '../../library/CBD/index.js';
import Modal from './Modal.js';
import style from './View.module.css';

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
