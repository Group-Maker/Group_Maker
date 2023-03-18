import { Component } from '@@/CBD';
import { getRecords } from '@/state';
import { RecordItem } from './RecordItem';
import style from './Records.module.css';

export class RecordList extends Component {
  DOMStr() {
    const { openModal } = this.props;

    // prettier-ignore
    return `
      <ol class="${style.recordList}">
        ${getRecords()
          .map(({ id, record }, idx) => new RecordItem({ id, record, recordOrder: idx + 1, openModal }).render())
          .join('')}
      </ol>`;
  }
}
