import { Component } from '../library/index.js';
import style from './Members.module.css';
import View from '../component/View.js';

export default class Members extends Component {
  render() {
    // prettier-ignore
    return `
      <button class="${style.deleteButton}">delete</button>
      <div class="modal" hidden>${new View({ 
        className: ['back', 'back'],
        contents: ['CANCEL', 'DELETE'], 
        message: 'ARE YOU SURE? This member will be deleted permanently!' 
      }).render()}
      </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `${style.eleteButton}`,
        handler: e => {
          e.target.nextElementSibling.removeAttribute('hidden');
        },
      },
    ];
  }
}

// Members 또는 Records 페이지에서 삭제버튼을 눌렀을 때 메시지랑 버튼 2개 뜸
// 둘 다 path가 들어가 있지 않음. c: back, back content: CANCEL, DELETE
// 메시지: ARE YOU SURE? This (member / records) will be deleted permanently! -> path 대신 target 이 필요함.
// 버튼 2개
// 이때는 팝업위의 버튼을 클릭했을 때 path로 이동이 아닌 closest('modal')에 hidden 을 추가해 주어야 함.
// `<button class="to-${c}">${content}</button>`
// `<button class="to-${c}">${content}</button>`.
