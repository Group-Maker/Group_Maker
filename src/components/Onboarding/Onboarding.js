/* eslint-disable curly */
/* eslint-disable lines-between-class-members */
import { Component } from '../../../library/CBD';
import style from './Onboarding.module.css';
import { appendStyles } from '../../utils';

export const ONBOARDING_PLACEMENT = {
  CENTER: 'center',
  TOP: 'top',
  TOP_LEFT: 'topLeft',
  TOP_RIGHT: 'topRight',
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottomLeft',
  BOTTOM_RIGHT: 'bottomRight',
  LEFT: 'left',
  LEFT_TOP: 'leftTop',
  LEFT_BOTTOM: 'leftBottom',
  RIGHT: 'right',
  RIGHT_TOP: 'rightTop',
  RIGHT_BOTTOM: 'rightBottom',
};

export default class Onboarding extends Component {
  #$container;
  #$tooltip;
  #$spotlight;

  constructor(props) {
    super(props);

    this.state = {
      stepIndex: this.props.stepIndex ?? 0,
      isControlled: this.props.stepIndex !== undefined,
    };
  }

  didMount() {
    this.#$container = document.querySelector(`.${style.container}`);
    this.#$tooltip = document.querySelector(`.${style.tooltip}`);
    this.#$spotlight = document.querySelector(`.${style.spotlight}`);

    this.layoutOnboarding();
    this.#unbindLayoutHandler = this.#bindLayoutHandler();

    document.body.style.overflowY = 'hidden';
  }

  didUpdate() {
    this.layoutOnboarding();
  }

  willUnmount() {
    this.#unbindLayoutHandler();
    document.body.style.overflowY = 'visible';
  }

  DOMStr() {
    const { stepIndex } = this.state;
    const { steps } = this.props;
    const step = steps[stepIndex];
    if (!step) {
      return null;
    }

    const { placement, title, content } = step;

    return /* html */ `
      <section class='${style.container}'>
        <div class='${style.overlay}'>
          <div class='${style.spotlight}'></div>
        </div>
        <div class='${style.tooltip} ${style[placement] ?? ''}'>
          <div>
            ${title ? /* html */ `<p class='${style.title}'>${title}</p>` : ''}
            <p class='${style.content}'>${content}</p>
          </div>
          <div class='${style.buttonBox}'>
            ${
              stepIndex
                ? /* html */ `
                <button class='${style.button} prev'>
                  prev
                </button>
                `
                : ''
            }
            <button class='${style.button} next'>
              ${stepIndex === steps.length - 1 ? 'finish' : 'next'}
            </button>
          </div>
          <button class="${style.closeButton}">
            <?xml version="1.0" encoding="utf-8"?>
            <svg fill="#FFFFFF" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,23A11,11,0,1,0,1,12,11.013,11.013,0,0,0,12,23ZM12,3a9,9,0,1,1-9,9A9.01,9.01,0,0,1,12,3ZM8.293,14.293,10.586,12,8.293,9.707A1,1,0,0,1,9.707,8.293L12,10.586l2.293-2.293a1,1,0,0,1,1.414,1.414L13.414,12l2.293,2.293a1,1,0,1,1-1.414,1.414L12,13.414,9.707,15.707a1,1,0,0,1-1.414-1.414Z"/>
            </svg>  
          </button>
        </div>
      </section>
    `;
  }

  getTargetElement(target) {
    const $target = document.querySelector(target);
    if (!$target) {
      console.warn(`Can't find onboarding target: ${target}`);
    }
    return $target;
  }

  locateTooltip(placement, { width, height, top, left }) {
    if (placement === ONBOARDING_PLACEMENT.CENTER) {
      return;
    }
    const { width: tooltipWidth, height: tooltipHeight } = this.#$tooltip.getBoundingClientRect();
    const style = {
      top: `${top}px`,
      left: `${left}px`,
    };
    const gap = 50;
    const widthDiff = width / 2 - tooltipWidth / 2;
    const heightDiff = height / 2 - tooltipHeight / 2;

    if (placement === ONBOARDING_PLACEMENT.TOP)
      style.transform = `translate3D(${widthDiff}px, -${tooltipHeight + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.TOP_LEFT)
      style.transform = `translate3D(${widthDiff - width}px, -${tooltipHeight + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.TOP_RIGHT)
      style.transform = `translate3D(${widthDiff + width}px, -${tooltipHeight + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM)
      style.transform = `translate3D(${widthDiff}px, ${height + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM_LEFT)
      style.transform = `translate3D(${widthDiff - width}px, ${height + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM_RIGHT)
      style.transform = `translate3D(${widthDiff + width}px, ${height + gap}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.LEFT)
      style.transform = `translate3D(-${tooltipWidth + gap}px, ${heightDiff}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.LEFT_TOP)
      style.transform = `translate3D(-${tooltipWidth + gap}px, ${heightDiff - height}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.LEFT_BOTTOM)
      style.transform = `translate3D(-${tooltipWidth + gap}px, ${heightDiff + height}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.RIGHT)
      style.transform = `translate3D(${width + gap}px, ${heightDiff}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.RIGHT_TOP)
      style.transform = `translate3D(${width + gap}px, ${heightDiff - height}px, 0)`;
    else if (placement === ONBOARDING_PLACEMENT.RIGHT_BOTTOM)
      style.transform = `translate3D(${width + gap}px, ${heightDiff + height}px, 0)`;

    appendStyles(this.#$tooltip, style);
  }

  spotlightTarget({ width, height, top, left }) {
    const style = Object.fromEntries(
      Object.entries({ width, height, top, left }).map(([property, value]) => [property, value + 'px'])
    );
    appendStyles(this.#$spotlight, style);
  }

  layoutOnboarding() {
    const { steps } = this.props;
    const { stepIndex } = this.state;
    const { target, placement } = steps[stepIndex];
    if (!target) {
      return;
    }

    const $target = this.getTargetElement(target);
    if (!$target) {
      return;
    }

    const clientRect = $target.getBoundingClientRect();
    this.locateTooltip(placement, clientRect);
    this.spotlightTarget(clientRect);
  }

  #bindLayoutHandler() {
    const handler = () => {
      appendStyles(this.#$container, { width: window.innerWidth, height: window.innerHeight });
      this.layoutOnboarding();
    };

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }
  #unbindLayoutHandler;

  changeStepByAmount(amount) {
    const { isControlled, stepIndex } = this.state;
    const { callback } = this.props;
    isControlled
      ? callback(stepIndex + amount)
      : this.setState(prev => ({ ...prev, stepIndex: prev.stepIndex + amount }));
  }

  setEvent() {
    return [
      {
        type: 'click',
        selector: `.${style.closeButton}`,
        handler: () => this.props.onFinish(),
      },
      {
        type: 'click',
        selector: `.${style.button}.prev`,
        handler: () => this.changeStepByAmount(-1),
      },
      {
        type: 'click',
        selector: `.${style.button}.next`,
        handler: () => this.changeStepByAmount(1),
      },
    ];
  }
}
