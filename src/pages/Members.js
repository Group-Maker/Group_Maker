import { Component } from '../library/index.js';
import MainLayout from '../components/MainLayout.js';
import style from './Members.module.css';

export default class Members extends Component {
  render() {
    return `
    ${new MainLayout().render()}

    `;
  }
}
