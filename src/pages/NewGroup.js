import MainLayout from '../components/MainLayout/MainLayout.js';
import { Component } from '../../library/CBD/index.js';

export default class NewGroup extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
       NewGRoUP!!!
    `;
  }
}
