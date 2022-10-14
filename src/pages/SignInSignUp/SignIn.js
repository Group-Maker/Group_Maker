import SignInSignUp from './SignInSignUp.js';
import { signinSchema } from './schema.js';
import style from './SignInSignUp.module.css';

export default class SignIn extends SignInSignUp {
  constructor() {
    super();
    this.schema = signinSchema;
  }

  render() {
    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signInForm}" novalidate>
      <h2 class="${style.subTitle}">SIGN IN</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="userid">EMAIL</label>
        <input class="${style.input}" type="text" id="userid" name="userid" required autocomplete="off" />
        <div class="error ${style.error}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${style.input}" type="password" id="password" name="password" required autocomplete="off" />
        <div class="error ${style.error}"></div>
      </div>
      <button class="submit-btn ${style.submitBtn}" disabled>SIGN IN</button>
      <a class="switchSignInSignUp ${style.link}" href="/signup">Join us</a>
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: `.${style.signInForm} input`,
        handler: e => this.validate(e, this.schema),
      },
    ];
  }
}
