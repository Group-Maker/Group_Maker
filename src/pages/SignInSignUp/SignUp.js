import SignInSignUp from './SignInSignUp.js';
import { signupSchema } from './schema.js';
import style from './SignInSignUp.module.css';

export default class SignUp extends SignInSignUp {
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
      <a class="${style.link}" href="javascript:void(0);">Sign in</a>
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: 'signin-signup-form input',
        handler: e => this.validate(e, signupSchema),
      },
    ];
  }
}
