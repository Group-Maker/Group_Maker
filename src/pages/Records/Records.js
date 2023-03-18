import { Component } from '@@/CBD';
import { MainLayout, DeleteModal } from '@/components';
import { removeRecord } from '@/state';
import { RecordList } from './RecordList';
import style from './Records.module.css';

export class Records extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      recordId: null,
    };
  }

  DOMStr() {
    // prettier-ignore
    return `
    <div class="mainContainer">
      ${new MainLayout().render()}
      <main class="main">
        <h2 class="title">Previous Records</h2>
        ${new RecordList({ openModal: this.openModal.bind(this) }).render()}
        ${
          this.state.isModalOpen
            ? new DeleteModal({
                target: 'record',
                onRemove: this.removeRecord.bind(this),
                closeModal: this.closeModal.bind(this),
              }).render()
            : ''
        }
      </main>
    </div>`;
  }

  removeRecord() {
    removeRecord(this.state.recordId);
  }

  openModal(recordId) {
    this.setState({ isModalOpen: true, recordId });
  }

  closeModal() {
    this.setState({ isModalOpen: false, recordId: null });
  }
}
