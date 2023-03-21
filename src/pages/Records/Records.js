import { Component } from '@@/CBD';
import { MainLayout, DeleteModal } from '@/components';
import { removeRecord, getUID, addRecord } from '@/state';
import { RecordList } from './RecordList';
import style from './Records.module.css';
import { deleteRecordOnLocal, deleteRecordOnServer } from '../../apis/records';
import { getRecordById } from '../../state';

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

  async removeRecord() {
    const id = this.state.recordId;
    const { record } = getRecordById(id);
    console.log(record);
    removeRecord(id);
    try {
      const uid = getUID();
      uid ? await deleteRecordOnServer(uid, id) : deleteRecordOnLocal(id);
    } catch (err) {
      console.log(err);
      addRecord(record);
    }
  }

  openModal(recordId) {
    this.setState({ isModalOpen: true, recordId });
  }

  closeModal() {
    this.setState({ isModalOpen: false, recordId: null });
  }
}
