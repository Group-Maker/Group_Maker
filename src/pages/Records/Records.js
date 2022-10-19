import { Component } from '../../../library/CBD/index.js';
import MainLayout from '../../components/MainLayout/MainLayout.js';
import DeleteModal from '../../components/Modals/DeleteModal.js';
import { removeRecord } from '../../state/index.js';
import RecordList from './RecordList.js';

export default class Records extends Component {
  constructor(props) {
    super(props);

    [this.modal, this.setModal] = this.useState({
      isOpen: false,
      recordId: null,
    });
  }

  DOMStr() {
    // prettier-ignore
    return `
    <div class="mainContainer">
      ${new MainLayout().render()}
      <main class="main">
        <h2 class="title">Previous Records</h2>
        ${new RecordList({ openModal: this.openModal.bind(this) }).render()}
        ${this.modal.isOpen
          ? new DeleteModal({
              target: 'record',
              onRemove: this.removeRecord.bind(this),
              closeModal: this.closeModal.bind(this),
            }).render()
          : ''}
      </main>
    </div>`;
  }

  removeRecord() {
    removeRecord(this.modal.recordId);
    this.closeModal();
  }

  openModal(recordId) {
    this.setModal({ isOpen: true, recordId });
  }

  closeModal() {
    this.setModal({ isOpen: false, recordId: null });
  }
}
