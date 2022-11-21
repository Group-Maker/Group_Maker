import { Component } from '../../../library/CBD/index.js';
import { getRecords } from '../../state/index.js';
import RecordItem from './RecordItem.js';
import style from './Records.module.css';

export default class RecordList extends Component {
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
