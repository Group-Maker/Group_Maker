import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import SaveModal from '../../components/modals/SaveModal.js';
import Members from './Members.js';
import Groups from './Groups.js';
import style from './Result.module.css';

export default class Result extends Component {
  constructor() {
    super();

    this.$dragTarget = null;
    this.fromMemberId = null;
    this.fromMemberIdx = null;
  }

  render() {
    return `
    ${new MainLayout(this.props).render()}
    <div class="${style.result}>
      ${new Members(this.props).render()}
      
      <button class="${style.retry}">RETRY</button>
      <button class="${style.save}">SAVE</button>
      <section class="modal hidden">
        ${new SaveModal().render()}
      </section>
    </div>
    `;
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.save}`,
        handler: () => {
          document.querySelector('.modal').classList.remove('hidden');
        },
      },
      {
        type: 'dragstart',
        selector: null,
        handler: this.onDragstart.bind(this),
      },
      {
        type: 'dragend',
        selector: null,
        handler: this.onDragend.bind(this),
      },
      {
        type: 'dragover',
        selector: null,
        handler: _.throttle(this.onDragover.bind(this)),
      },
      {
        type: 'drop',
        selector: null,
        handler: this.onDrop.bind(this),
      },
    ];
  }
}
