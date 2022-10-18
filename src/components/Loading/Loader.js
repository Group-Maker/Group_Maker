import { Component } from '../../../library/CBD/index.js';
import style from './Loader.module.css';

export default class Loader extends Component {
  render() {
    return `<p class=${style.loadingMsg}>Loading...</p>`;
  }
}
