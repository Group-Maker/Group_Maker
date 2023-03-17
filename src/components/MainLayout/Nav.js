import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import style from './Nav.module.css';

export default class Nav extends Component {
  DOMStr() {
    const currentPath = window.location.pathname;

    // prettier-ignore
    return `
      <nav>
        <ul class="${style.ul}">
          ${this.props.linkInfo.map(linkInfo => `
            <li class="${style.li} ${linkInfo.path === currentPath ? style.active : ''}" data-onboarding-id="${linkInfo.onboardingId}">
              ${new Link(linkInfo).render()}
            </li>`).join('')}
        </ul>
      </nav>`;
  }
}
