import { Component } from '../CBD/index.js';
import { navigate } from './router.js';

export default class Link extends Component {
  render() {
    const { path = '/', content = '', classNames = [] } = this.props;
    return `
      <a href="${path}" class="innerLink ${classNames.join(' ')}">${content}</a>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.innerLink',
        handler: e => {
          e.preventDefault();
          const path = e.target.closest('.innerLink').getAttribute('href');
          navigate(path);
        },
      },
    ];
  }
}
