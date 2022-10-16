import { Component } from '../../library/CBD/index.js';
import MainLayout from '../components/MainLayout/MainLayout.js';
// import style from './Records.module.css';
// import View from '../component/View.js';

export default class Records extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
      RECORDS!!
      ${this.props.organization.records.map(record => `<span>${record}</span>`)}
    `;
  }
}
