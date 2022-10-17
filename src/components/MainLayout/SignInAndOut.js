import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import style from './SignInAndOut.module.css';

class SignInLink extends Component {
  render() {
    return new Link({
      path: '/signin',
      content: 'SIGN IN',
      classNames: [style.signInAndOut],
    }).render();
  }
}
class SignOutButton extends Component {
  render() {
    return `<button type="button" class="signOutBtn ${style.signInAndOut}">SIGN OUT</button>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: '.signOutBtn',
        handler: e => {
          // console.log(this.p)
          this.props.signOut(e);
        },
      },
    ];
  }
}

export { SignInLink, SignOutButton };
