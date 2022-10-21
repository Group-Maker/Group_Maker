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
      $targetContainer: null,
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
        <div class="${style.dropContainer} ${style.members}">
          <h3 class="${style.subTitle}">Member List</h3>
          ${
          currentView === 'autoResult' ? '' : new Members().render()
          }</div>
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
        selector: `.${style.dropContainer}`,
        handler: throttle(this.onDragover.bind(this)),
      },
      {
        type: 'drop',
        selector: `.${style.dropContainer}`,
        handler: this.onDrop.bind(this),
      },
    ];
  }

  getMemberId($target) {
    return +$target.closest('div').dataset.listId;
  }

  onDragstart(e) {
    this.state.$dragTarget = e.target.closest('div');
    this.state.$dragTarget.classList.add(`${style.dragging}`);
    this.state.fromMemberId = this.getMemberId(this.$dragTarget);
  }

  onDragend() {
    this.state.$dragTarget.classList.remove(`${style.dragging}`);
  }

  onDragover(e) {
    e.preventDefault();

    this.state.$targetContainer = e.target.closest(`.${style.dropContainer}`);
    this.state.$targetContainer.appendChild(this.state.$dragTarget);
  }

  onDrop(e) {
    e.preventDefault();
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
