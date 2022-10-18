import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import style from './SignInAndOut.module.css';

class SignInLink extends Component {
  render() {
    return new Link({ path: '/signin', content: 'SIGN IN', classNames: [style.signInLink] }).render();
  }
}
class SignOutButton extends Component {
  render() {
    return `<button type="button" class="${style.signOutBtn}">SIGN OUT</button>`;
  }

  async signout() {
    try {
      await axios.get('/auth/signout');
      this.props.signOutSetState();
    } catch (err) {
      console.log(err);
    }
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.signOutBtn}`,
        handler: () => this.signout(),
      },
    ];
  }
}

export { SignInLink, SignOutButton };
