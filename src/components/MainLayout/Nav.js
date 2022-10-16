import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import style from './Nav.module.css';

export default class Nav extends Component {
  render() {
    const currentPath = window.location.pathname;

    return `
    <nav>
      <ul>
        ${this.props.linkInfo
          .map(
            linkInfo => `
          <li class="${style.li} ${linkInfo.path === currentPath ? style.active : ''}">
            ${new Link(linkInfo).render()}
          </li>`
          )
          .join('')}
      </ul>
    </nav>`;
  }
}
