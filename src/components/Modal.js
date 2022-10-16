import { Component } from '../../library/index.js';
import style from './Modal.module.css';

export default class Modal extends Component {
  render() {
    const { className, contents, message, path } = this.props;

    // prettier-ignore
    return `
      <div class="${style.alert}">${message}</div>
      <div class="${style.buttons}">
      ${contents.map((content, i) => `
        <a href="${path ? path[i] : ''}" class="to-${className[i]}">${content}</a>`
      ).join('')}
      </div>
    `;
  }
}
