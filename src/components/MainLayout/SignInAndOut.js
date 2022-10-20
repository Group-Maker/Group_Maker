import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import { setUserAndOrganization } from '../../state/index.js';
import { loadFromLocalStorage } from '../../utils/localStorage.js';
import style from './SignInAndOut.module.css';

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
      // TODO 로그아웃 기능을 하는 함수로 다시 받을 것
      await axios.get('/auth/signout');
      const organization = loadFromLocalStorage();
      setUserAndOrganization({
        user: null,
        organization,
      });
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
