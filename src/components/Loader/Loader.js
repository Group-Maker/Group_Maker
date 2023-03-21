import { Component } from '@@/CBD';
import style from './Loader.module.css';

export class Loader extends Component {
  DOMStr() {
    return `
      <div class="${style.spinner}">
        <?xml version="1.0" encoding="utf-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="147px" height="147px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.875s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(45 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(90 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.625s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(135 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(180 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.375s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(225 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(270 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.125s" repeatCount="indefinite"></animate>
          </rect>
        </g><g transform="rotate(315 50 50)">
          <rect x="46.5" y="23.5" rx="3.5" ry="3.5" width="7" height="7" fill="#ffffff">
            <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
          </rect>
        </g>
        <span class="${style.loadingMsg}">Loading...</span>
      </div>
     `;
  }
}
