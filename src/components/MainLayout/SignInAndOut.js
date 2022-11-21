import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link, navigate } from '../../../library/SPA-router/index.js';
import { setUserAndOrganization } from '../../state/index.js';
import { loadFromLocalStorage } from '../../utils/localStorage.js';
import style from './SignInAndOut.module.css';
import storeOnServer from '../../api/index';

class SignInLink extends Component {
  DOMStr() {
    return new Link({ path: '/signin', content: 'SIGN IN', classNames: [style.signInLink] }).render();
  }
}
class SignOutButton extends Component {
  DOMStr() {
    return `<button type="button" class="${style.signOutBtn}">SIGN OUT</button>`;
  }

  async signout() {
    try {
      storeOnServer();
      console.log('stored');
      await axios.get('/auth/signout');
      const organization = loadFromLocalStorage();
      setUserAndOrganization({
        user: null,
        userId: null,
        organization,
      });
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.signOutBtn}`,
        handler: this.signout.bind(this),
      },
    ];
  }
}

export { SignInLink, SignOutButton };
