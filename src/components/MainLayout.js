import 'boxicons';
import { Component } from '../library/index.js';
import style from './MainLayout.module.css';

export default class MainLayout extends Component {
  render() {
    return `
      <nav class="${style.nav}">
        <h1 class="${style.title}">GROUP MAKER</h1>
        <p class="${style.description}">In the repeated group activities,\nwe make a group\nwhere you can be with new people.</p>
        <a class="${style['login-link']}" href="signin">SIGNIN</a>
        <ul>
          <li class="${style['menu-item']}">
            <a href="members" class="${style['members-link']}">MANAGE MEMBERS</a>
          </li>
          <li class="${style['menu-item']}">
            <a href="records" class="${style['records-link']}">PREVIOUS RECORDS</a>
          </li>
          <li class="${style['menu-item']}">
            <a href="new-group" class="${style['new-group-link']}">MAKE\nNEW GROUP</a>
          </li>
        </ul>
        <ul class="${style['sub-menu']}">
          <li>
            <a class="${style['github-link']}" href="https://github.com/Group-Maker/Group_Maker" rel="noopener noreferrer" target="_blank">
              <box-icon class="${style.icon}" type='logo' name='github'></box-icon>
            </a>
          </li>
          <li>
            <a class="${style['issue-link']}" href="https://github.com/Group-Maker/Group_Maker/issues/new" rel="noopener noreferrer" target="_blank">
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
}
