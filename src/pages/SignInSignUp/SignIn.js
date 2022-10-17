import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { signinSchema } from './schema.js';
import validate from './validate.js';
import { navigate } from '../../../library/SPA-router/index.js';
import style from './SignInSignUp.module.css';

export default class SignIn extends Component {
  async signin(e) {
    e.preventDefault();

    const payload = [...new FormData(e.target)].reduce(
      // eslint-disable-next-line no-return-assign, no-sequences
      (obj, [key, value]) => ((obj[key] = value), obj),
      {}
    );

    try {
      // request with payload & move to another page
      const { data: user } = await axios.post(`/auth/signin`, payload);

      if (user) {
        this.props.signInSetState(user);
        navigate('/');
      }
    } catch (err) {
      if (err.response.status === 401) {
        document.querySelector('.signInError').textContent = 'Incorrect email or password';
      }
    }
  }

  render() {
    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signInForm}" novalidate>
      <h2 class="${style.subTitle}">SIGN IN</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="userid">EMAIL</label>
        <input class="${style.input}" type="text" id="userid" name="userid" required autocomplete="off" />
        <div class="validateError ${style.validateError}"></div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${style.input}" type="password" id="password" name="password" required autocomplete="off" />
        <div class="validateError ${style.validateError}"></div>
      </div>
      <p class="signInError ${style.authorizeError}"></p>
      <button class="submit-btn ${style.submitBtn}" disabled>SIGN IN</button>
      <a class="switchSignInSignUp ${style.link}" href="/signup">Join us</a>
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: `.${style.signInForm} input`,
        handler: e => validate(e, signinSchema),
      },
      {
        type: 'submit',
        selector: `.${style.signInForm}`,
        handler: e => this.signin(e),
      },
    ];
  }
}
