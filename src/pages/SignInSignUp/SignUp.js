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
      userid: { value: '', isDirty: false },
      name: { value: '', isDirty: false },
      password: { value: '', isDirty: false },
      confirmPassword: { value: '', isDirty: false },
      isSignUpFailed: false,
    };
    this.state = this.initialSignUpForm;
  }

  async checkDuplicatedUserid(inputUserid) {
    try {
      const { data: isDuplicated } = await axios.post('/auth/checkDuplicated', { inputUserid });

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
      await axios.post(`/auth/signup`, payload);
      // TODO: 모달 관련 코드 수정 필요
      document.querySelector('.modal').classList.remove('hidden');
    } catch (err) {
      // if (err.response.status === 401) {
      // }
      console.log(err);
    }
  }

  renderIcon(isValid) {
    return isValid
      ? `<box-icon class="${style.icon} ${style.iconSuccess}" name="check-circle"></box-icon>`
      : `<box-icon class="${style.icon} ${style.iconError}" name="x-circle"></box-icon>`;
  }

  DOMStr() {
    const useridValue = this.state.userid.value;
    const nameValue = this.state.name.value;
    const passwordValue = this.state.password.value;
    const confirmPasswordValue = this.state.confirmPassword.value;
    const isUseridValid = signUpSchema.userid.isValid(useridValue);
    const isNameValid = !!nameValue;
    const isPasswordValid = signUpSchema.password.isValid(passwordValue);
    const isConfirmPasswordValid = passwordValue === confirmPasswordValue;

    // prettier-ignore
    return `
      <div class="${style.container}">
        <h1 class="title">${new Link({ path: '/', content: 'GROUP MAKER' }).render()}</h1>
        <form class="${style.signUpForm}">
          <h2 class="${style.subTitle}">SIGN-UP</h2>
          <div class="${style.inputWrapper}">
            <div class="${style.inputContainer}">
              <label class="${style.label}" for="userid">EMAIL</label>
              <input class="useridInput ${
                style.input
              }" type="text" id="userid" name="userid" required autocomplete="off" value="${useridValue}"/>
              ${this.state.userid.isDirty ? this.renderIcon(isUseridValid) : ''}
              <div class="${style.validateError}">${
                this.state.userid.isDirty && !isUseridValid ? signUpSchema.userid.error : ''
              }</div>
            </div>
            <div class="${style.inputContainer}">
              <label class="${style.label}" for="name">NAME</label>
              <input class="${style.input}" type="text" id="name" name="name" required autocomplete="off" value="${
                this.state.name.value
              }"/>
              ${this.state.name.isDirty ? this.renderIcon(isNameValid) : ''}
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
              ${this.state.password.isDirty ? this.renderIcon(isPasswordValid) : ''}
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
              ${this.state.confirmPassword.isDirty ? this.renderIcon(isConfirmPasswordValid) : ''}
              <div class="validateError ${style.validateError}">${
                this.state.confirmPassword.isDirty && !isConfirmPasswordValid ? signUpSchema.confirmPassword.error : ''
              }</div>
            </div>
          </div>
          <div class="${style.btnWrapper}">
            <button class="submit-btn ${style.submitBtn}" ${
              isUseridValid && isNameValid && isPasswordValid && isConfirmPasswordValid ? '' : 'disabled'
            }>SIGN UP</button>
            ${new Link({ path: '/signin', content: 'Sign in', classNames: ['switchSignInSignUp', style.link] }).render()}
          </div>
        </form>
      </div>`;
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
        selector: '.useridInput',
        handler: e => this.checkDuplicatedUserid(e.target.value),
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
