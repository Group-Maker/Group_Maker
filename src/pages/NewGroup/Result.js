import { Component } from '../../../library/CBD/index.js';
import SaveModal from '../../components/Modals/SaveModal.js';
import Member from '../../components/Result/Member.js';
import Groups from '../../components/Result/Groups.js';
import style from './Result.module.css';

export default class Result extends Component {
  constructor(props, resultState) {
    super(props);
    this.resultState = resultState;

    [this.state, this.setState] = this.useState({
      $dragTarget: null,
      $targetContainer: null,
      fromListId: null,
      // 테스트를 위한 상태값 고정
      isModalOpen: false,
    });
  }

  render() {
    const { organization } = this.props;
    const { result, currentView } = this.resultState;
    console.log(organization);
    // prettier-ignore
    return `
    <section class="${style.result}">
      <h2 class="${style.title}">Result</h2>
      <div class="${style.dropContainer} ${style.members}">${currentView === 'autoResult' ? '' : new Member({ organization }).render()}</div>
      <div class="${style.groups}">${new Groups({ organization, result}).render()}</div>
      <div class="${style.buttons}">
        ${currentView === 'autoResult' ? `<button class="${style.retry}">RETRY</button>` : `<button class="${style.reset}">RESET</button>`}
        <button class="${style.save}">SAVE</button>
      </div>
      ${this.state.isModalOpen ? new SaveModal({ closeModal: this.closeModal.bind(this) }).render() : ''}
    </section>
    `;
  }

  setEvent() {
    return [
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
    document.querySelectorAll(`.${style.groups} > div`).forEach(group => {
      const groupArr = [];
      group.querySelectorAll('div').forEach(el => {
        groupArr.push(this.getMemberId(el));
      });
      groupsArr.push(groupArr);
    });

    return groupsArr;
  }

  saveRecord() {
    this.state.result = this.getResult();
    this.props.addRecord(this.state.result);

    this.openModal();
  }

  openModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: true }));
  }

  closeModal() {
    this.setState(prevState => ({ ...prevState, isModalOpen: false }));
  }
}
