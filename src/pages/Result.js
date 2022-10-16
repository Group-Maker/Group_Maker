import { Component } from '../../library/CBD/index.js';
import MainLayout from '../components/MainLayout/MainLayout.js';
// import style from './Result.module.css';
// import View from '../component/View.js';

export default class Result extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
    `;
  }
}
