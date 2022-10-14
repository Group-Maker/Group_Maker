import MainLayout from '../components/MainLayout.js';
import { Component } from '../library/index.js';

export default class Result extends Component {
  render() {
    return `
       ${new MainLayout(this.props).render()}
    `;
  }
}
