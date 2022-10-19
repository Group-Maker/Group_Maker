import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import { SignInLink, SignOutButton } from './SignInAndOut.js';
import Nav from './Nav.js';
import { getUser } from '../../state/index.js';
import style from './MainLayout.module.css';
import 'boxicons';

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.linkInfo = [
      { path: '/', classNames: [style.membersLink], content: 'MANAGE MEMBERS' },
      { path: '/records', classNames: [style.recordsLink], content: 'PREVIOUS RECORDS' },
      { path: '/newgroup', classNames: [style.newgroupLink], content: `MAKE<br />NEW GROUP` },
    ];
  }

  DOMStr() {
    const user = getUser();

    // prettier-ignore
    return `
      <section class="${style.container}">
        <h1 class="${style.title}">${new Link({ path: '/', content: 'GROUP MAKER' }).render()}</h1>
        <p class="${
          style.description
        }">In the repeated group activities, we make a group where you can be with new people.</p>
        ${user ? new SignOutButton().render() : new SignInLink().render()}
        ${new Nav({ linkInfo: this.linkInfo }).render()}
        <ul class="${style.subMenu}">
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker" class="${
              style.githubLink
            }" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" type="logo" name="github"></box-icon>
            </a>
          </li>
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker/issues/new" class="${
              style.issueLink
            }" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" name="info-circle"></box-icon>
            </a>
          </li>
          <li>
            <button type="button" class="${style.settingBtn}">
              <box-icon class="${style.icon}" name="cog"></box-icon>
            </button>
          </li>
        </ul>
      </section>`;
  }
}
