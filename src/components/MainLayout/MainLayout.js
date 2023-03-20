import { Component } from '@@/CBD';
import { Link, navigate } from '@@/SPA-router';
import { enableOnboarding, getUser, setUserAndOrganization } from '@/state';
import { getOrganizationOnLocal, signOut } from '@/apis';
import { ONBOARDING_ID, ROUTE_PATH } from '@/constants';
import Nav from './Nav';
import style from './MainLayout.module.css';
import 'boxicons';

export class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.linkInfo = [
      {
        path: ROUTE_PATH.members,
        classNames: [style.membersLink],
        content: 'MANAGE MEMBERS',
        onboardingId: ONBOARDING_ID.MEMBERS_PAGE,
      },
      {
        path: ROUTE_PATH.records,
        classNames: [style.recordsLink],
        content: 'PREVIOUS RECORDS',
        onboardingId: ONBOARDING_ID.RECORDS_PAGE,
      },
      {
        path: ROUTE_PATH.newgroup,
        classNames: [style.newgroupLink],
        content: `GENERATE<br />OPTIMAL GROUPS`,
        onboardingId: ONBOARDING_ID.NEW_GROUP_PAGE,
      },
    ];
  }

  DOMStr() {
    const user = getUser();

    // prettier-ignore
    return `
      <section class="${style.container}">
        <h1 class="logoLink">${new Link({ path: ROUTE_PATH.members, content: 'OPTIMAL<br/ >GROUP<br/ >GENERATOR' }).render()}</h1>
        <p class="${style.description}">We generate groups<br>where everyone can be<br>with new people.</p>
         ${
           user
             ? `<button type="button" class="${style.signOutBtn}">SIGN OUT</button>`
             : new Link({ path: ROUTE_PATH.signin, content: 'SIGN IN', classNames: [style.signInLink] }).render()
         }
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
      await signOut();

      const organization = getOrganizationOnLocal();
      setUserAndOrganization({
        uid: null,
        userId: null,
        user: null,
        organization: organization,
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
