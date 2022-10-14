import 'boxicons';
import { Component } from '../library/index.js';
import style from './MainLayout.module.css';

const SignInAndOutButton = userType =>
  userType === 'guest'
    ? `<a href="/signin" class="innerLink ${style.loginLink}" >SIGNIN</a>`
    : `<a href="/" class="innerLink ${style.loginLink}" >SIGNOUT</a>`;

const MainLinks = path => {
  const linkInfo = [
    {
      href: '/',
      className: style.membersLink,
      content: 'MANAGE MEMBERS',
    },
    {
      href: '/records',
      className: style.recordsLink,
      content: 'PREVIOUS RECORDS',
    },
    {
      href: '/newgroup',
      className: style.newgroupLink,
      content: 'MAKE\nNEW GROUP',
    },
  ];

  // prettier-ignore
  return `
    <ul>
      ${ linkInfo.map( ( { href, className, content } ) => `
        <li>
          <a href="${ href }" class="innerLink ${ className } ${ path === href ? style.active : '' }">
            ${ content }
          </a>
        </li>`).join( '' )}
    </ul>`;
};

export default class MainLayout extends Component {
  render() {
    const { path, userType } = this.props;
    console.log(path);
    // prettier-ignore
    return `
      <nav class="${style.nav}">
        <h1 class="${style.title}">GROUP MAKER</h1>
        <p class="${
          style.description
        }">In the repeated group activities,\nwe make a group\nwhere you can be with new people.</p>
        ${SignInAndOutButton(userType)}
        ${MainLinks(path)}
        <ul class="${style.subMenu}">
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker" class="${
              style.githubLink
            }" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" type='logo' name='github'></box-icon>
            </a>
          </li>
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker/issues/new" class="${
              style.issueLink
            }" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" name='info-circle' ></box-icon>
            </a>
          </li>
          <li>
            <button class="${style.settingBtn}" class="setting-btn">
              <box-icon class="${style.icon}" name='cog' ></box-icon>
            </button>
          </li>
        </ul>
      </nav>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.innerLink',
        handler: e => {
          if (!e.target.closest('.innerLink')) {
            return;
          }

          e.preventDefault();
          const path = e.target.closest('.innerLink').getAttribute('href');
          this.props.navigate(path);
        },
      },
    ];
  }
}
