import 'boxicons';
import { Component } from '../library/index.js';
import style from './MainLayout.module.css';

export default class MainLayout extends Component {
  render() {
    return `
      <nav class="${style.nav}">
        <h1 class="${style.title}">GROUP MAKER</h1>
        <p class="${style.description}">In the repeated group activities,\nwe make a group\nwhere you can be with new people.</p>
        <a href="/signin" class="inner-link ${style['login-link']}" >SIGNIN</a>
        <ul>
          <li class="${style['menu-item']}">
            <a href="/" class="inner-link ${style['members-link']}">MANAGE MEMBERS</a>
          </li>
          <li class="${style['menu-item']}">
            <a href="/records" class="inner-link ${style['records-link']}">PREVIOUS RECORDS</a>
          </li>
          <li class="${style['menu-item']}">
            <a href="/newgroup" class="inner-link ${style['newgroup-link']}">MAKE\nNEW GROUP</a>
          </li>
        </ul>
        <ul class="${style['sub-menu']}">
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker" class="${style['github-link']}" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" type='logo' name='github'></box-icon>
            </a>
          </li>
          <li>
            <a href="https://github.com/Group-Maker/Group_Maker/issues/new" class="${style['issue-link']}" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" name='info-circle' ></box-icon>
            </a>
          </li>
          <li>
            <button class="${style['setting-btn']}" class="setting-btn">
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
        selector: '.inner-link',
        handler: e => {
          if (!e.target.closest('.inner-link')) {
            return;
          }

          e.preventDefault();
          const path = e.target.closest('.inner-link').getAttribute('href');
          this.props.navigate(path);
        },
      },
    ];
  }
}
