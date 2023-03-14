import { Component } from '../../../library/CBD/index.js';
import Link from '../../../library/SPA-router/Link.js';
import style from './NotFound.module.css';

export default class NotFound extends Component {
  DOMStr() {
    return `
      <div class="${style.container}">
        <h1 class="logoLink">${new Link({ path: '/', content: 'GROUP MAKER' }).render()}</h1>
        <span class="${style.notFoundMsg}">Sorry, the page you are looking for does not exist.</span>
        <div class="${style.goToHome}">${new Link({ path: '/', content: 'GO TO HOME' }).render()}</div>
      </div>`;
  }
}
