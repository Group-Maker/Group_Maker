import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link, navigate } from '../../../library/SPA-router/index.js';
import Nav from './Nav.js';
import { enableOnboarding, getOrganization, getUser, getuserId, setUserAndOrganization } from '../../state/index.js';
import { LocalStorage, ORGANIZATION_KEY } from '../../utils/localStorage.js';
import { ONBOARDING_ID } from '../../constants/onboarding.js';
import style from './MainLayout.module.css';
import 'boxicons';

export default class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.linkInfo = [
      {
        path: '/',
        classNames: [style.membersLink],
        content: 'MANAGE MEMBERS',
        onboardingId: ONBOARDING_ID.MEMBERS_PAGE,
      },
      {
        path: '/records',
        classNames: [style.recordsLink],
        content: 'PREVIOUS RECORDS',
        onboardingId: ONBOARDING_ID.RECORDS_PAGE,
      },
      {
        path: '/newgroup',
        classNames: [style.newgroupLink],
        content: `MAKE<br />NEW GROUP`,
        onboardingId: ONBOARDING_ID.NEW_GROUP_PAGE,
      },
    ];
    this.organizationStorage = new LocalStorage(ORGANIZATION_KEY);
  }

  DOMStr() {
    const user = getUser();

    // prettier-ignore
    return `
      <section class="${style.container}">
        <h1 class="${style.title}">${new Link({ path: '/', content: 'GROUP MAKER' }).render()}</h1>
        <p class="${
          style.description
        }">We make a group<br>where you can be with<br>new people.</p>
        ${user 
          ? `<button type="button" class="${style.signOutBtn}">SIGN OUT</button>` 
          : new Link({ path: '/signin', content: 'SIGN IN', classNames: [style.signInLink] }).render()}
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
            <button type="button" class="${style.settingBtn}" data-onboarding-id="${ONBOARDING_ID.HELP}">
              <box-icon class="${style.icon}" name="help-circle"></box-icon>
            </button>
          </li>
        </ul>
      </section>`;
  }

  async signout() {
    try {
      const payload = { userId: getuserId(), newOrganization: getOrganization() };
      await axios.post('/organization', payload);

      await axios.get('/auth/signout');

      const localOrganization = this.organizationStorage.getItem();
      setUserAndOrganization({
        user: null,
        userId: null,
        organization: localOrganization,
      });
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.signOutBtn}`,
        handler: this.signout.bind(this),
      },
      {
        type: 'click',
        selector: `.${style.settingBtn}`,
        handler: enableOnboarding,
      },
    ];
  }
}
