import axios from 'axios';
import 'boxicons';
import { Component } from '../../../library/CBD/index.js';
import { Link } from '../../../library/SPA-router/index.js';
import { signUpSchema } from './schema.js';
import SignupModal from '../../components/Modals/SignupModal.js';
import style from './SignInSignUp.module.css';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.initialSignUpForm = {
      email: { value: '', isDirty: false },
      name: { value: '', isDirty: false },
      password: { value: '', isDirty: false },
      confirmPassword: { value: '', isDirty: false },
      isSignUpFailed: false,
    };
    this.state = this.initialSignUpForm;
  }

  async checkDuplicatedEmail(inputEmail) {
    try {
      const { data: isDuplicated } = await axios.post('/auth/checkDuplicated', { inputEmail });

      if (isDuplicated) {
        this.setState(prevState => ({ ...prevState, isSignUpFailed: true }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  async signUp(e) {
    e.preventDefault();

    const payload = [...new FormData(e.target)].reduce(
      // eslint-disable-next-line no-return-assign, no-sequences
      (obj, [key, value]) => ((obj[key] = value), obj),
      {}
    );

    try {
      await axios.post(`/auth/signUp`, payload);
      // TODO: 모달 관련 코드 수정 필요
      document.querySelector('.modal').classList.remove('hidden');
    } catch (err) {
      // if (err.response.status === 401) {
      // }
      console.log(err);
    }
  }

  render() {
    const emailValue = this.state.email.value;
    const nameValue = this.state.name.value;
    const passwordValue = this.state.password.value;
    const confirmPasswordValue = this.state.confirmPassword.value;
    const isEmailValid = signUpSchema.email.isValid(emailValue);
    const isNameValid = !!nameValue;
    const isPasswordValid = signUpSchema.password.isValid(passwordValue);
    const isConfirmPasswordValid = passwordValue === confirmPasswordValue;

    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signUpForm}">
      <h2 class="${style.subTitle}">SIGN-UP</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="email">EMAIL</label>
        <input class="emailInput ${
          style.input
        }" type="text" id="email" name="email" required autocomplete="off" value="${emailValue}"/>
        ${
          this.state.email.isDirty
            ? isEmailValid
              ? `<box-icon class="${style.icon} ${style.iconSuccess}" name='check-circle'></box-icon>`
              : `<box-icon class="${style.icon} ${style.iconError}" name='x-circle'></box-icon>`
            : ''
        }
        <div class="${style.validateError}">${
      this.state.email.isDirty && !isEmailValid ? signUpSchema.email.error : ''
    }</div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="name">NAME</label>
        <input class="${style.input}" type="text" id="name" name="name" required autocomplete="off" value="${
      this.state.name.value
    }"/>
    ${
      this.state.name.isDirty
        ? isNameValid
          ? `<box-icon class="${style.icon} ${style.iconSuccess}" name='check-circle'></box-icon>`
          : `<box-icon class="${style.icon} ${style.iconError}" name='x-circle'></box-icon>`
        : ''
    }
        <div class="${style.validateError}">${
      this.state.name.isDirty && !isNameValid ? signUpSchema.name.error : ''
    }</div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${
          style.input
        }" type="password" id="password" name="password" required autocomplete="off" value="${
      this.state.password.value
    }"/>
    ${
      this.state.password.isDirty
        ? isPasswordValid
          ? `<box-icon class="${style.icon} ${style.iconSuccess}" name='check-circle'></box-icon>`
          : `<box-icon class="${style.icon} ${style.iconError}" name='x-circle'></box-icon>`
        : ''
    }
        <div class="validateError ${style.validateError}">${
      this.state.password.isDirty && !isPasswordValid ? signUpSchema.password.error : ''
    }</div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="confirmPassword">CONFIRM PASSWORD</label>
        <input class="${
          style.input
        }" type="password" id="confirmPassword" name="confirmPassword" required autocomplete="off" value="${
      this.state.confirmPassword.value
    }"/>
    ${
      this.state.confirmPassword.isDirty
        ? isConfirmPasswordValid
          ? `<box-icon class="${style.icon} ${style.iconSuccess}" name='check-circle'></box-icon>`
          : `<box-icon class="${style.icon} ${style.iconError}" name='x-circle'></box-icon>`
        : ''
    }
        <div class="validateError ${style.validateError}">${
      this.state.confirmPassword.isDirty && !isConfirmPasswordValid ? signUpSchema.confirmPassword.error : ''
    }</div>
      </div>
      <p class="signUpError ${style.authorizeError}"></p>
      <button class="submit-btn ${style.submitBtn}" ${
      isEmailValid && isNameValid && isPasswordValid && isConfirmPasswordValid ? '' : 'disabled'
    }>SIGN UP</button>
      <section class="modal hidden">
        ${new SignupModal().render()}
      </section>
      ${new Link({ path: '/signin', content: 'Sign in', classNames: ['switchSignInSignUp', style.link] }).render()}
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: `.${style.signUpForm} input`,
        handler: e => {
          this.setState(prevState => ({
            ...prevState,
            [e.target.name]: { value: e.target.value, isDirty: true },
          }));
        },
      },
      {
        type: 'input',
        selector: `.emailInput`,
        handler: e => this.checkDuplicatedEmail(e.target.value),
      },
      {
        type: 'submit',
        selector: `.${style.signUpForm}`,
        handler: e => this.signUp(e),
      },
      {
        type: 'click',
        selector: `.switchSignInSignUp`,
        handler: () => this.setState(this.initialSignUpForm),
      },
    ];
  }
}
