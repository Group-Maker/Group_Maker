import { Component } from '../library/index.js';
import style from './Members.module.css';

export default class Members extends Component {
  render() {
    return `<h1 class="${style.red}">
    <p >빨간색!</p>
    멤버!!!</h1>`;
  }
}
