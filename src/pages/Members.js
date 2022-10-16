import { Component } from '../../library/index.js';
import MainLayout from '../components/MainLayout.js';

export default class Members extends Component {
  render() {
    return `
      ${new MainLayout(this.props).render()}
      MEMBERS!!
      ${this.props.organization.members.map(({ id, name }) => `<span>${id} / ${name}</span>`)}
    `;
  }
}
