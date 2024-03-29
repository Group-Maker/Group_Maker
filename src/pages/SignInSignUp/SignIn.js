import { Component } from '@@/CBD';
import { Link, navigate } from '@@/SPA-router';
import { setUserAndOrganization } from '@/state';
import { signIn } from '@/apis';
import { ROUTE_PATH } from '@/constants';
import { sanitize } from '@/utils';
import { signInSchema } from './schema';
import style from './SignInSignUp.module.css';

export class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: { value: '', isDirty: false },
      password: { value: '', isDirty: false },
      isSignInFailed: false,
    };
  }

  async signIn(e) {
    e.preventDefault();

    try {
      const payload = [...new FormData(e.target)].reduce(
        // eslint-disable-next-line no-return-assign, no-sequences
        (obj, [key, value]) => ((obj[key] = sanitize(value)), obj),
        {}
      );

      const { uid, userId, user, organization } = await signIn(payload);
      setUserAndOrganization({ uid, userId, user, organization });
      navigate('/');
    } catch (err) {
      // TODO: 로그인 실패시 입력창을 비워줄지 결정 필요
      // this.setState({ isSignInFailed: true });
      console.log(err);
      this.setState(prevState => ({ ...prevState, isSignInFailed: true }));
    }
  }

  DOMStr() {
    const userIdValue = this.state.userId.value;
    const passwordValue = this.state.password.value;
    const isuserIdValid = signInSchema.userId.isValid(userIdValue);
    const isPasswordValid = signInSchema.password.isValid(passwordValue);

    // prettier-ignore
    return `
      <div class="${style.container}">
        <h1 class="title">${new Link({ path: ROUTE_PATH.members, content: 'GROUP MAKER' }).render()}</h1>
        <form class="${style.signInForm}">
          <h2 class="${style.subTitle}">SIGN IN</h2>
          <div class="${style.inputWrapper}">
            <div class="${style.inputContainer}">
              <label class="${style.label}" for="userId">EMAIL</label>
              <input class="${
                style.input
              }" type="text" id="userId" name="userId" required autocomplete="off" value="${userIdValue}" />
              <div class="${style.validateError}">${
                this.state.userId.isDirty && !isuserIdValid ? signInSchema.userId.error : ''
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
          </div>
          <div class="${style.btnWrapper}">
            <p class="signInError ${style.authorizeError}">${
              this.state.isSignInFailed ? 'Incorrect email or password' : ' '
            }</p>
            <button class="submit-btn ${style.submitBtn}" ${
              isuserIdValid && isPasswordValid ? '' : 'disabled'
            }>SIGN IN</button>
            ${new Link({ path: ROUTE_PATH.signup, content: 'Join us', classNames: ['switchSignInSignUp', style.link] }).render()}
          </div>
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
