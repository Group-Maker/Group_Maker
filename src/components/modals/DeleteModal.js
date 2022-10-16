import { Component } from '../../../library/CBD/index.js';
import style from './Modal.module.css';

export default class DeleteModal extends Component {
  render() {
    const { target } = this.props;
    // prettier-ignore
    return `
      <div class="${style.overlay}"></div>
      <div class="${style.content}">
        <div class="${style.message}">
        <div>ARE YOU SURE?</div>
          This ${target} will be\n
          deleted permanently!
        </div>
        <div class="${style.buttons}">
          <button class="${style.btn}">CANCEL</button>
          <button class="${style.btn} ${style.warning}">DELETE</button>
        </div>
      </div>
    `;
  }

  setEvent() {}
}
