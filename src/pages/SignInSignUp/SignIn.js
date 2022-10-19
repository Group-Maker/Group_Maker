import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link, navigate } from '../../../library/SPA-router/index.js';
import { setUserAndOrganization } from '../../state/index.js';
import { signInSchema } from './schema.js';
import style from './SignInSignUp.module.css';

export default class signIn extends Component {
  constructor(props) {
    super(props);
    this.initialSignInForm = {
      email: { value: '', isDirty: false },
      password: { value: '', isDirty: false },
      isSignInFailed: false,
    };
    this.state = this.initialSignInForm;
  }

  async signIn(e) {
    e.preventDefault();

    const payload = [...new FormData(e.target)].reduce(
      // eslint-disable-next-line no-return-assign, no-sequences
      (obj, [key, value]) => ((obj[key] = value), obj),
      {}
    );

    try {
      const { data } = await axios.post(`/auth/signin`, payload);
      const { user, organization } = data;

      setUserAndOrganization({ user, organization });
      navigate('/');
    } catch (err) {
      // if (err.response.status === 401) {
      // TODO: 로그인 실패시 입력창을 비워줄지 결정 필요
      // this.setState({ isSignInFailed: true });
      this.setState(prevState => ({ ...prevState, isSignInFailed: true }));
      // }
    }
  }

  render() {
    const emailValue = this.state.email.value;
    const passwordValue = this.state.password.value;
    const isEmailValid = signInSchema.email.isValid(emailValue);
    const isPasswordValid = signInSchema.password.isValid(passwordValue);

    return `
    <h1 class="${style.title}">GROUP-MAKER</h1>
    <form class="${style.signInForm}">
      <h2 class="${style.subTitle}">SIGN IN</h2>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="email">EMAIL</label>
        <input class="${
          style.input
        }" type="text" id="email" name="email" required autocomplete="off" value="${emailValue}" />
        <div class="${style.validateError}">${
      this.state.email.isDirty && !isEmailValid ? signInSchema.email.error : ''
    }</div>
      </div>
      <div class="${style.inputContainer}">
        <label class="${style.label}" for="password">PASSWORD</label>
        <input class="${
          style.input
        }" type="password" id="password" name="password" required autocomplete="off" value="${passwordValue}"/>
        <div class="${style.validateError}">${
      this.state.password.isDirty && !isPasswordValid ? signInSchema.password.error : ''
    }</div>
      </div>
      <p class="signInError ${style.authorizeError}">${
      this.state.isSignInFailed ? 'Incorrect email or password' : ''
    }</p>
      <button class="submit-btn ${style.submitBtn}" ${
      isEmailValid && isPasswordValid ? '' : 'disabled'
    }>SIGN IN</button>
      ${new Link({ path: '/signup', content: 'Join us', classNames: ['switchSignInSignUp', style.link] }).render()}
    </form>`;
  }

  setEvent() {
    return [
      {
        type: 'input',
        selector: `.${style.signInForm} input`,
        handler: e => {
          this.setState(prevState => ({
            ...prevState,
            [e.target.name]: { value: e.target.value, isDirty: true },
          }));
        },
      },
      {
        type: 'submit',
        selector: `.${style.signInForm}`,
        handler: e => this.signIn(e),
      },
      {
        type: 'click',
        selector: `.switchSignInSignUp`,
        handler: () => this.setState(this.initialSignInForm),
      },
    ];
  }
}
