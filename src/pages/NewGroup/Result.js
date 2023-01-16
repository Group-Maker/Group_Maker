import { throttle } from 'lodash';
import { Component } from '../../../library/CBD/index.js';
import Members from '../../components/Result/Members.js';
import Groups from '../../components/Result/Groups.js';
import { addRecord, getActiveMemberIds } from '../../state/index.js';
import style from './Result.module.css';

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.$initTargetzone = null;
    this.$dragTarget = null;
    this.$dropTarget = null;
    this.$startzone = null;
    this.$targetzone = null;
    this.$ghost = null;

    const {
      resultState: { currentView, result },
    } = this.props;

    this.state = {
      memberArr: currentView === 'autoResult' ? [] : getActiveMemberIds(),
      groupArr: result,
    };
  }

  DOMStr() {
    const {
      resultState: { currentView },
    } = this.props;
    const { memberArr, groupArr } = this.state;

    // prettier-ignore
    return `
      <div>
        <h2 class="title">Result</h2>
        <h3 class="${style.subTitle}">MemberList</h3>
        <div class="dropzone ${style.members}">
          ${new Members({ memberArr }).render()}
        </div>
        <div class="${style.groups}">${new Groups({ groupArr }).render()}</div>
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
        selector: '.dropzone',
        handler: throttle(this.onDragover.bind(this)),
      },
      {
        type: 'drop',
        selector: 'document',
        handler: this.onDrop.bind(this),
      },
    ];
  }

  getMemberId($target) {
    return +$target.dataset.listId;
  }

  getGroupId($target) {
    return +$target.dataset.listId;
  }

  swap($node1, $node2) {
    const group1 = this.getGroupId($node1);
    const group2 = this.getGroupId($node2);

    this.setState(prevState => {
      let groupArr = prevState.groupArr;
      [groupArr[group1], groupArr[group2]] = [groupArr[group2], groupArr[group1]];

      return {
        ...prevState,
        groupArr: groupArr,
      };
    });
  }

  appendDragImage() {
    this.$ghost = document.createElement('div');
    const $ghostChild = this.$dragTarget.cloneNode(true);

    $ghostChild.classList.add(`${style.ghost}`);

    this.$ghost.appendChild($ghostChild);
    document.body.appendChild(this.$ghost);

    return this.$ghost;
  }

  removeDragImage() {
    document.body.removeChild(this.$ghost);
  }

  onDragstart(e) {
    if (e.target.matches(`.${style.group}`)) {
      this.$dragTarget = e.target;
      this.$dragTarget.classList.add(`${style.dragging}`);
    }

    if (e.target.matches(`.${style.member}`)) {
      this.$dragTarget = e.target.closest('.draggable');
      this.$dragTarget.classList.add(`${style.dragging}`);
      e.dataTransfer.setDragImage(this.appendDragImage(), e.offsetX, e.offsetY);
      this.$initTargetzone = e.target.closest('.dropzone');
      this.$startzone = e.target.closest('.dropzone');
    }
  }

  onDragend(e) {
    this.$dragTarget.classList.remove(`${style.dragging}`);

    if (e.target.matches(`.${style.member}`)) {
      // delete ghostimage
      this.removeDragImage();
    }
  }

  onDragover(e) {
    e.preventDefault();

    if (this.$dragTarget.matches(`.${style.member}`)) {
      this.$targetzone = e.target.closest('.dropzone');
      if (this.$targetzone === this.$startzone) return;

      this.$startzone = this.$targetzone;
      this.$targetzone.children[0].appendChild(this.$dragTarget);
    }
  }

  onDrop(e) {
    e.preventDefault();

    // from memberList
    if (this.$dragTarget.matches(`.${style.member}`) && this.$initTargetzone.matches(`.${style.members}`)) {
      // to group
      if (e.target.closest('.dropzone').matches(`.${style.group}`)) {
        const to = this.getGroupId(this.$targetzone);
        const targetId = this.getMemberId(this.$dragTarget);

        this.setState(({ memberArr, groupArr }) => {
          return {
            memberArr: memberArr.filter(member => member !== targetId),
            groupArr: groupArr.map((group, id) => (id === to ? [...group, targetId] : group)),
          };
        });
      }
    }

    // from group
    if (this.$dragTarget.matches(`.${style.member}`) && this.$initTargetzone.matches(`.${style.group}`)) {
      if (this.$targetzone === this.$initTargetzone) return;

      // to group
      if (e.target.closest('.dropzone').matches(`.${style.group}`)) {
        const to = this.getGroupId(this.$targetzone);
        const targetId = this.getMemberId(this.$dragTarget);

        this.setState(prevState => {
          const nextState = prevState.groupArr.map((group, id) =>
            id === to ? [...group, targetId] : group.filter(member => member !== targetId)
          );

          return {
            ...prevState,
            groupArr: nextState,
          };
        });
      }

      // to memberList
      if (e.target.closest('.dropzone').matches(`.${style.members}`)) {
        const targetId = this.getMemberId(this.$dragTarget);

        this.setState(({ memberArr, groupArr }) => {
          memberArr.push(targetId);
          return {
            memberArr: memberArr,
            groupArr: groupArr.map(group => group.filter(member => member !== targetId)),
          };
        });
      }
    }

    if (this.$dragTarget.matches(`.${style.group}`)) {
      this.$dropTarget = e.target.closest(`.${style.group}`) ?? null;

      if (!this.$dropTarget || this.$dragTarget === this.$dropTarget) return;

      this.swap(this.$dropTarget, this.$dragTarget);
    }
  }

  saveRecord() {
    addRecord(this.state.groupArr);

    // will change to dialog
    alert('Successfully saved!');
  }
}
