import { Component } from '../../../library/CBD/index.js';

export default class Result extends Component {
  constructor(props, result) {
    super(props);
    this.result = result;
  }

  render() {
    console.log(this.result);
    return `
      <h2>Result</h2>
    `;
  }
}
