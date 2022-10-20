import axios from 'axios';
import { Component } from '../../../library/CBD/index.js';
import { Link, navigate } from '../../../library/SPA-router/index.js';
import { setUserAndOrganization } from '../../state/index.js';
import { signInSchema } from './schema.js';
import style from './SignInSignUp.module.css';

export default class signIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: { value: '', isDirty: false },
      password: { value: '', isDirty: false },
      isSignInFailed: false,
    };
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
      console.log(data);
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

  DOMStr() {
    const useridValue = this.state.userid.value;
    const passwordValue = this.state.password.value;
    const isUseridValid = signInSchema.userid.isValid(useridValue);
    const isPasswordValid = signInSchema.password.isValid(passwordValue);

    // prettier-ignore
    return `
      <div>
        <h1 class="${style.title}">GROUP-MAKER</h1>
        <form class="${style.signInForm}">
          <h2 class="${style.subTitle}">SIGN IN</h2>
          <div class="${style.inputContainer}">
            <label class="${style.label}" for="userid">EMAIL</label>
            <input class="${
              style.input
            }" type="text" id="userid" name="userid" required autocomplete="off" value="${useridValue}" />
            <div class="${style.validateError}">${
              this.state.userid.isDirty && !isUseridValid ? signInSchema.userid.error : ''
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
            isUseridValid && isPasswordValid ? '' : 'disabled'
          }>SIGN IN</button>
          ${new Link({ path: '/signup', content: 'Join us', classNames: ['switchSignInSignUp', style.link] }).render()}
        </form>
      </div>`;
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
    ];
  }
}
