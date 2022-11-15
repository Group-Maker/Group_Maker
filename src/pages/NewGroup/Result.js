import { throttle } from 'lodash';
import { Component } from '../../../library/CBD/index.js';
import Members from '../../components/Result/Members.js';
import Groups from '../../components/Result/Groups.js';
import { addRecord } from '../../state/index.js';
import style from './Result.module.css';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      $dragTarget: null,
      $dropTarget: null,
      $startzone: null,
      $targetzone: null,
      fromMemberId: null,
    };
  }

  DOMStr() {
    const { resultState } = this.props;
    const { result, currentView } = resultState;

    // prettier-ignore
    return `
      <div>
        <h2 class="title">Result</h2>
        <h3 class="${style.subTitle}">MemberList</h3>
        <div class="dropzone ${style.members}">
          ${
            currentView === 'autoResult' ? '<ul></ul>' : new Members().render()
          }
        </div>
        <div class="${style.groups}">${new Groups({ result }).render()}</div>
        <div class="${style.buttons}">
          ${
            currentView === 'autoResult'
              ? `<button type="button" class="resetBtn ${style.retry}">RETRY</button>`
              : `<button type="button" class="resetBtn ${style.reset}">RESET</button>`
          }
          <button class="${style.save}">SAVE</button>
        </div>
      </div>`;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.buttons} .resetBtn`,
        handler: () => this.props.resetGroup(),
      },
      {
        type: 'click',
        selector: `.${style.save}`,
        handler: this.saveRecord.bind(this),
      },
      {
        type: 'dragstart',
        selector: 'document',
        handler: this.onDragstart.bind(this),
      },
      {
        type: 'dragend',
        selector: 'document',
        handler: this.onDragend.bind(this),
      },
      {
        type: 'dragover',
        selector: `.dropzone`,
        handler: throttle(this.onDragover.bind(this)),
      },
      {
        type: 'drop',
        selector: 'document',
        handler: this.onDrop.bind(this),
      },
    ];
  }

  swap($node1, $node2) {
    if ($node1 === $node2) return;
    // console.log($node1);
    // console.log($node2);
    // console.log($node1.parentNode);
    // console.log($node2.parentNode);
    $node1.parentNode.replaceChild($node2.cloneNode(true), $node1);
    $node2.parentNode.replaceChild($node1.cloneNode(true), $node2);
  }

  getMemberId($target) {
    // console.log($target.dataset.listId);
    return +$target.dataset.listId;
  }

  // appendDragImage() {
  //   const $ghost = document.createElement('div');
  //   const $ghostChild = this.state.$dragTarget.cloneNode(true);

  //   this.state.$dragTarget.classList.add(`${style.dragging}`);

  //   $ghost.appendChild($ghostChild);
  //   document.body.appendChild($ghost);

  //   return $ghost;
  // }

  onDragstart(e) {
    console.log(e.target);

    if (e.target.matches(`.${style.group}`)) {
      this.state.$dragTarget = e.target;
      // this.state.$dragTarget.classList.add(`${style.dragging}`);
    }

    if (e.target.matches(`.${style.member}`)) {
      this.state.$dragTarget = e.target.closest('.draggable');
      // e.dataTransfer.setDragImage(this.appendDragImage(), e.offsetX, e.offsetY);
      this.state.$dragTarget.classList.add(`${style.dragging}`);

      this.state.$startzone = e.target.closest('.dropzone');
      this.state.fromMemberId = this.getMemberId(this.state.$dragTarget);
    }

    // console.log('dragstart');
  }

  onDragend() {
    this.state.$dragTarget.classList.remove(`${style.dragging}`);
    // console.log('dragEnd');
  }

  onDragover(e) {
    // console.log('dragover');
    e.preventDefault();

    if (this.state.$dragTarget.matches(`.${style.member}`)) {
      this.state.$targetzone = e.target.closest('.dropzone');
      if (this.state.$targetzone !== this.state.$startzone) {
        this.state.$startzone = this.state.$targetzone;
        // console.log(this.state.$targetzone);
        this.state.$targetzone.children[0].appendChild(this.state.$dragTarget);
      }
    }
  }

  onDrop(e) {
    e.preventDefault();

    if (this.state.$dragTarget.matches(`.${style.group}`)) {
      this.state.$dropTarget = e.target.closest(`.${style.group}`);

      this.swap(this.state.$dropTarget, this.state.$dragTarget);
    }
  }

  // 수정이 필요하다,,
  getResult() {
    const groupsArr = [];
    document.querySelectorAll(`.${style.groups} > div > div`).forEach(group => {
      const groupArr = [];
      group.querySelectorAll('div').forEach(el => {
        groupArr.push(this.getMemberId(el));
      });
      groupsArr.push(groupArr);
    });
    return groupsArr;
  }

  saveRecord() {
    const record = this.getResult();
    addRecord(record);
    alert('Successfully saved!');
  }
}
