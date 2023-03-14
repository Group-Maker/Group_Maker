import { Component } from '../../../library/CBD/index.js';
import style from './Members.module.css';

export default class MemberItem extends Component {
  DOMStr() {
    const { member, editingMember } = this.props;
    const { id, name } = member;
    const isEditing = editingMember.id === id;

    // TODO: data-name 없이?
    // TODO: sanitize(https://www.npmjs.com/package/sanitize-html)
    // TODO: 글자 1개일 때 Input 상태와 Span 상태 글 미묘한 padding 변화 해결 필요
    // 입력값에 따라 길이가 달라지는 input: https://codepen.io/chaerin-dev/pen/gOdgPMN
    return `
      <li data-id="${id}" data-name="${name}" class="${style.memberItem}">
        ${
          isEditing
            ? `<label data-value="${name}">
                <input id="addMemberInput" type="text" value="${name}" size="1" maxlength="20">
              </label>`
            : `<span>${name}</span>
              <button aria-label="delete member">
                <?xml version="1.0" encoding="utf-8"?>
                <svg fill="#FFFFFF" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,23A11,11,0,1,0,1,12,11.013,11.013,0,0,0,12,23ZM12,3a9,9,0,1,1-9,9A9.01,9.01,0,0,1,12,3ZM8.293,14.293,10.586,12,8.293,9.707A1,1,0,0,1,9.707,8.293L12,10.586l2.293-2.293a1,1,0,0,1,1.414,1.414L13.414,12l2.293,2.293a1,1,0,1,1-1.414,1.414L12,13.414,9.707,15.707a1,1,0,0,1-1.414-1.414Z"/>
                </svg>
              </button>`
        }
      </li>`;
  }

  setEvent() {
    const { openModal, onUpdate, toggleEditMode, editingMember } = this.props;

    return [
      {
        type: 'input',
        selector: `.${style.memberItem} input`,
        handler: e => {
          e.target.closest('label').dataset.value = e.target.value;
        },
      },
      {
        type: 'keydown',
        selector: `.${style.memberItem} input`,
        handler: e => {
          if (e.key === 'Enter') {
            const id = +e.target.closest(`.${style.memberItem}`).dataset.id;
            const trimmedValue = e.target.value.trim();
            if (editingMember.name === trimmedValue || trimmedValue === '') {
              toggleEditMode({ id: null, name: null });
              return;
            }
            onUpdate({ id, name: trimmedValue });
          }

          if (e.key === 'Escape') {
            toggleEditMode({ id: null, name: null });
          }
        },
      },
      {
        type: 'click',
        selector: `.${style.memberItem} button`,
        handler: e => {
          const id = +e.target.closest(`.${style.memberItem}`).dataset.id;
          openModal(id);
        },
      },
      {
        type: 'dblclick',
        selector: `.${style.memberItem}`,
        handler: e => {
          const $li = e.target.closest(`.${style.memberItem}`);
          const { id, name } = $li.dataset;
          toggleEditMode({ id: +id, name });
        },
      },
    ];
  }
}
