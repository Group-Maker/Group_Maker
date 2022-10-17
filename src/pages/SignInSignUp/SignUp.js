import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { signupSchema } from './schema.js';
import validate from './validate.js';
import style from './SignInSignUp.module.css';
import SignupModal from '../../components/modals/SignupModal.js';

export default class SignUp extends Component {
  async checkDuplicated(e) {
    try {
      const { data: isDuplicated } = await axios.post('/auth/checkDuplicated', { inputId: e.target.value });

      if (isDuplicated) {
        document.querySelector('.signUpError').textContent = 'Account already exists';
      }
    } catch (err) {
      console.log(err);
    }
  }

  async signup(e) {
    e.preventDefault();

    const payload = [...new FormData(e.target)].reduce(
      // eslint-disable-next-line no-return-assign, no-sequences
      (obj, [key, value]) => ((obj[key] = value), obj),
      {}
    );

    try {
      // request with payload
      await axios.post(`/auth/signup`, payload);
      document.querySelector('.modal').classList.remove('hidden');
    } catch (err) {
      if (err.response.status === 401) {
        document.querySelector('.signUpError').textContent = 'Account already exists';
      }
    }
  }

  render() {
    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signUpForm}" novalidate>
      <h2 class="${style.subTitle}">SIGN-UP</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="userid">EMAIL</label>
        <input class="emailInput ${style.input}" type="text" id="userid" name="userid" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="signUpError validateError ${style.validateError}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="name">NAME</label>
        <input class="${style.input}" type="text" id="name" name="username" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="validateError ${style.validateError}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${style.input}" type="password" id="password" name="password" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="validateError ${style.validateError}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="confirm-password">CONFIRM PASSWORD</label>
        <input class="${
          style.input
        }" type="password" id="confirm-password" name="confirm-password" required autocomplete="off" />
        <span class="bar"></span>
        <i class="${style.icon} ${style.iconSuccess} icon-success bx bxs-check-circle hidden"></i>
        <i class="${style.icon} ${style.iconError} icon-error bx bxs-x-circle hidden"></i>
        <div class="validateError ${style.validateError}"></div>
      </div>
      <p class="signUpError ${style.authorizeError}"></p>
      <button class="submit-btn ${style.submitBtn}" disabled>SIGN UP</button>
      <section class="modal hidden">
        ${new SignupModal().render()}
      </section>
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
        type: 'input',
        selector: `.emailInput`,
        handler: e => this.checkDuplicated(e),
      },
      {
        type: 'submit',
        selector: `.${style.signUpForm}`,
        handler: e => this.signup(e),
      },
    ];
  }
}
