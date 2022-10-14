import { Component } from '../library/index.js';
import style from './Modal.module.css';

export default class Modal extends Component {
  render() {
    // console.log(this.props);
    const { className, contents, message, path } = this.props;

    return `
      <div class="${style.alert}">${message}</div>
      <div class="${style.buttons}">
      ${contents
        .map(
          (content, i) => `<button><a href="${path ? path[i] : ''}" class="to-${className[i]}">${content}</a></button>`
        )
        .join('')}
      </div>
    `;
  }
}
