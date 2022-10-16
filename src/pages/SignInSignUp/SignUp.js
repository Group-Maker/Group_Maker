import { Component } from '../../../library/CBD/index.js';
import { signupSchema } from './schema.js';
import validate from './validate.js';
import style from './SignInSignUp.module.css';

export default class SignUp extends Component {
  render() {
    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signUpForm}" novalidate>
      <h2 class="${style.subTitle}">SIGN-UP</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="userid">EMAIL</label>
        <input class="${style.input}" type="text" id="userid" name="userid" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="error ${style.error}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="name">NAME</label>
        <input class="${style.input}" type="text" id="name" name="username" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="error ${style.error}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${style.input}" type="password" id="password" name="password" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="error ${style.error}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="confirm-password">CONFIRM PASSWORD</label>
        <input class="${style.input}" type="password" id="confirm-password" name="confirm-password" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="error ${style.error}"></div>
      </div>
      <button class="submit-btn ${style.submitBtn}" disabled>SIGN UP</button>
      <a class="switchSignInSignUp ${style.link}" href="/signin">Sign in</a>
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: `.${style.signUpForm} input`,
        handler: e => validate(e, signupSchema),
      },
      {
        type: 'click',
        selector: `${style.signupButton}`,
        handler: e => {
          e.target.nextElementSibling.removeAttribute('hidden');
        },
      },
    ];
  }
}

// render() {
//   // prettier-ignore
//   return `
//   <button class="${style.signupButton}">Sign up</button>
//   <div class="${style.modal}" hidden>${new View({
//     className: ['signin'],
//     contents: ['Sign in'],
//     message: `Congratulation!\n Now you can Sign in`,
//     path: ['/SignIn'],
//   }).render()}
//   </div>
//   `;
// }

// setEvent() {
//   return [
//     {
//       type: 'click',
//       selector: `${style.signupButton}`,
//       handler: e => {
//         e.target.nextElementSibling.removeAttribute('hidden');
//       },
//     },
//   ];
// }
