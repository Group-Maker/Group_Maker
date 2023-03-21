/* eslint-disable curly */
/* eslint-disable lines-between-class-members */
import { Component } from '@@/CBD';
import { appendStyles, formatTranslate3DCSS } from '@/utils';
import style from './Onboarding.module.css';
import 'boxicons';

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

export class Onboarding extends Component {
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

    document.body.style.overflow = 'hidden';
  }

  didUpdate() {
    this.layoutOnboarding();
  }

  willUnmount() {
    this.#unbindLayoutHandler();
    document.body.style.overflow = 'visible';
  }

  DOMStr() {
    const { stepIndex } = this.state;
    const { steps } = this.props;
    const step = steps[stepIndex];
    if (!step) {
      return null;
    }

    const { placement, title, content, hideBackButton, hideCloseButton, locale = {} } = step;
    const { start = 'Start', finish = 'Finish', prev = 'Prev', next = 'Next' } = locale;

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
              stepIndex !== 0 && !hideBackButton
                ? /* html */ `
                <button class='${style.button} prev'>
                  ${prev}
                </button>
                `
                : ''
            }
            <button class='${style.button} next'>
              ${stepIndex === steps.length - 1 ? finish : stepIndex === 0 ? start : next}
            </button>
          </div>
          ${
            !hideCloseButton
              ? /* html */ `
              <button class="${style.closeButton}">
                <box-icon class="${style.closeIcon}" name='x'></box-icon>  
              </button>`
              : ''
          }
        </div>
      </section>
    `;
  }

  locateTooltip(placement, $target) {
    if (placement === ONBOARDING_PLACEMENT.CENTER) {
      return;
    }

    const { width: targetWidth, height: targetHeight, top, left } = $target.getBoundingClientRect();
    const { width: tooltipWidth, height: tooltipHeight } = this.#$tooltip.getBoundingClientRect();

    const style = {
      top: `${top}px`,
      left: `${left}px`,
    };

    const gap = 50;
    const tailGap = 62;
    const widthDiff = targetWidth / 2 - tooltipWidth / 2;
    const heightDiff = targetHeight / 2 - tooltipHeight / 2;

    if (placement === ONBOARDING_PLACEMENT.TOP) style.transform = formatTranslate3DCSS(widthDiff, -tooltipHeight - gap);
    else if (placement === ONBOARDING_PLACEMENT.TOP_LEFT)
      style.transform = formatTranslate3DCSS(widthDiff - tooltipWidth / 2 + tailGap, -tooltipHeight - gap);
    else if (placement === ONBOARDING_PLACEMENT.TOP_RIGHT)
      style.transform = formatTranslate3DCSS(widthDiff + tooltipWidth / 2 - tailGap, -tooltipHeight - gap);
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM)
      style.transform = formatTranslate3DCSS(widthDiff, targetHeight + gap);
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM_LEFT)
      style.transform = formatTranslate3DCSS(widthDiff - tooltipWidth / 2 + tailGap, targetHeight + gap);
    else if (placement === ONBOARDING_PLACEMENT.BOTTOM_RIGHT)
      style.transform = formatTranslate3DCSS(widthDiff + tooltipWidth / 2 - tailGap, targetHeight + gap);
    else if (placement === ONBOARDING_PLACEMENT.LEFT)
      style.transform = formatTranslate3DCSS(-tooltipWidth - gap, heightDiff);
    else if (placement === ONBOARDING_PLACEMENT.LEFT_TOP)
      style.transform = formatTranslate3DCSS(-tooltipWidth - gap, heightDiff - tooltipHeight / 2 + tailGap);
    else if (placement === ONBOARDING_PLACEMENT.LEFT_BOTTOM)
      style.transform = formatTranslate3DCSS(-tooltipWidth - gap, heightDiff + tooltipHeight / 2 - tailGap);
    else if (placement === ONBOARDING_PLACEMENT.RIGHT)
      style.transform = formatTranslate3DCSS(targetWidth + gap, heightDiff);
    else if (placement === ONBOARDING_PLACEMENT.RIGHT_TOP)
      style.transform = formatTranslate3DCSS(targetWidth + gap, heightDiff - tooltipHeight / 2 + tailGap);
    else if (placement === ONBOARDING_PLACEMENT.RIGHT_BOTTOM)
      style.transform = formatTranslate3DCSS(targetWidth + gap, heightDiff + tooltipHeight / 2 - tailGap);

    appendStyles(this.#$tooltip, style);
  }

  spotlightTarget($target) {
    const { width, height, top, left } = $target.getBoundingClientRect();
    const { borderRadius } = getComputedStyle($target);
    const style = Object.fromEntries(
      Object.entries({ width, height, top, left, borderRadius }).map(([property, value]) => [property, value])
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

    const $target = document.querySelector(target);
    if (!$target) {
      return;
    }
    this.locateTooltip(placement, $target);
    this.spotlightTarget($target);
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
    callback(stepIndex + amount);
    !isControlled && this.setState(prev => ({ ...prev, stepIndex: prev.stepIndex + amount }));
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
