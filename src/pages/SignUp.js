import { Component } from '../library/index.js';
import style from './SignUp.module.css';
import View from '../component/View.js';

export default class SignUp extends Component {
  render() {
    // prettier-ignore
    return `
    <button class="${style.signupButton}">Sign up</button>
    <div class="${style.modal}" hidden>${new View({
      className: ['signin'],
      contents: ['Sign in'],
      message: `Congratulation!\n Now you can Sign in`,
      path: ['/SignIn'],
    }).render()}
    </div>
    `;
  }

  setEvent() {
    return [
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

// signUp에서 버튼을 누르면 모달이 뜨면서 거기에 메시지랑 버튼이 뜸.
// 버튼의 path: /SignIn,  c: signin, content: Sign in
// 메시지: Congratulation!Now you can Sign in, 버튼 1개
// `<button href="/${path}" class="to-${c}">${content}</button>`
