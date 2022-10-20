import { Component } from '../../../library/CBD/index.js';
import SaveModal from '../../components/Modals/SaveModal.js';
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
      fromListId: null,
      // 테스트를 위한 상태값 고정
      isModalOpen: false,
    };
  }

  DOMStr() {
    const { returnToSelectCount, resultState } = this.props;
    const { result, currentView } = resultState;

    // prettier-ignore
    return `
      <div>
        <h2 class="title">Result</h2>
        <div class="${style.dropContainer} ${style.members}">${
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
        ${
          this.state.isModalOpen
            ? new SaveModal({ closeModal: this.closeModal.bind(this), returnToSelectCount }).render()
            : ''
        }
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
        handler: _.throttle(this.onDragover.bind(this)),
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

  getMemberName(id) {
    return id.closest('div').dataset.listIdx;
  }

  onDragstart(e) {
    this.$dragTarget = e.target.closest('div');
    this.$dragTarget.classList.add(`${style.dragging}`);
    this.fromMemberId = this.getMemberId(this.$dragTarget);
  }

  onDragend() {
    this.$dragTarget.classList.remove(`${style.dragging}`);
  }

  onDragover(e) {
    e.preventDefault();

    this.targetContainer = e.target.closest(`.${style.dropContainer}`);
    this.targetContainer.appendChild(this.$dragTarget);
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.dataTransfer);
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
    console.log(groupsArr);
    return groupsArr;
  }

  saveRecord() {
    this.state.result = this.getResult();
    addRecord(this.state.result);

    this.openModal();
  }

  openModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: true }));
  }

  closeModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: false }));
  }
}
