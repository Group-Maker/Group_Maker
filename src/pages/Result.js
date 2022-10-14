import { Component } from '../library/index.js';
import style from './Result.module.css';
import View from '../component/View.js';

export default class Result extends Component {
  render() {
    return `
    <button class="${style['save-button']}">SAVE!</button>
    <div class="modal" hidden>${new View({
      className: ['records', 'newgroup'],
      contents: ['모든 기록 보기', '조 더 짜기'],
      message: 'Store Records!',
      path: ['/Records', '/NewGroup'],
    }).render()}</div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `${style['save-button']}`,
        handler: e => {
          e.target.nextElementSibling.removeAttribute('hidden');
        },
      },
    ];
  }
}

// Result 에서 save 버튼을 누르면 메시지랑 버튼 2개 뜸
// 버튼의 path: /Records, /NewGroup, c: records, newgroup content: 모든 기록 보기, 조 더 짜기
// 메시지: Store Records! 버튼2개
// `<button href="/${path}" class="to-${c}">${content}</button>`
