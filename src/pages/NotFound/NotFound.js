import { Component } from '@@/CBD';
import Link from '@@/SPA-router/Link.js';
import { ROUTE_PATH } from '@/constants';
import style from './NotFound.module.css';

export class NotFound extends Component {
  DOMStr() {
    return `
      <div class="${style.container}">
        <span class="${style.notFoundMsg}">Sorry, the page you are looking for does not exist.</span>
        <div class="${style.goToHome}">${new Link({ path: ROUTE_PATH.members, content: 'GO TO HOME' }).render()}</div>
      </div>`;
  }
}
