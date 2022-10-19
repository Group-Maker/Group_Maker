import { Component } from '../../../library/CBD/index.js';
import RecordItem from './RecordItem.js';
import style from './Records.module.css';

export default class RecordList extends Component {
  render() {
    const { organization, openModal } = this.props;
    const { records, members } = organization;

    // prettier-ignore
    return `
      <ol class="${style.recordList}">
        ${records.map(({ id, record }, idx) =>
            new RecordItem({ id, record, recordOrder: idx + 1, members, openModal }).render()
          ).join('')}
      </ol>
    `;
  }
}
