import { updateEventHandlers } from './eventHandler';

const reconciliation = ($virtualNode, $realNode) => {
  if ($virtualNode.nodeType !== $realNode.nodeType) {
    $realNode.replaceWith($virtualNode);
    return;
  }

  if ($virtualNode.nodeType === Node.TEXT_NODE || $virtualNode.nodeType === Node.COMMENT_NODE) {
    if ($realNode.nodeValue.trim() !== $virtualNode.nodeValue.trim()) {
      $realNode.nodeValue = $virtualNode.nodeValue;
    }
    return;
  }

  if ($virtualNode.tagName !== $realNode.tagName) {
    $realNode.replaceWith($virtualNode);
    return;
  }

  // 속성을 비교해서 갱신한다

  $realNode.getAttributeNames().forEach(attr => !$virtualNode.hasAttribute(attr) && $realNode.removeAttribute(attr));
  [...$virtualNode.attributes].forEach(({ name, value }) => {
    switch (name) {
      case 'class':
        [...$realNode.classList, ...$virtualNode.classList].forEach(className => {
          $realNode.classList.toggle(className, $virtualNode.classList.contains(className));
        });
        break;
      case 'style':
        [...$realNode.style, ...$virtualNode.style].forEach(key => {
          $realNode.style[key] = $virtualNode.style[key];
        });
        break;
      default:
        $realNode.setAttribute(name, value);
    }
  });

  // 프로퍼티를 비교해서 갱신한다
  const coreProperties = ['selected', 'checked', 'value'];
  coreProperties.forEach(key => {
    if ($realNode[key] !== $virtualNode[key]) {
      $realNode[key] = $virtualNode[key];
    }
  });

  // 자식노드들 비교

  const $virtualChildNodes = [...$virtualNode.childNodes];
  const $realChildNodes = [...$realNode.childNodes];

  for (let i = 0; i < Math.max($virtualChildNodes.length, $realChildNodes.length); i++) {
    const $vNode = $virtualChildNodes[i];
    const $rNode = $realChildNodes[i];

    if ($vNode && $rNode) {
      reconciliation($vNode, $rNode);
    }
    if (!$vNode) {
      $rNode.remove();
    }
    if (!$rNode) {
      $realNode.appendChild($vNode);
    }
  }
};

let init = true;
let $rootContainer = null;
let RootComponentInstance = null;

const createVirtualRoot = DOMStr => {
  const $temp = document.createElement('div');
  $temp.innerHTML = DOMStr;
  if ($temp.childElementCount > 1) {
    throw new Error('컴포넌트는 반드시 하나의 요소로 감싸야 합니다!');
  }
  return $temp.firstElementChild;
};

const render = ($container, componentInstance) => {
  let $real;
  let $virtual;

  if (init || !componentInstance) {
    if (init) {
      $rootContainer = $container;
      RootComponentInstance = componentInstance;
      init = false;
    }
    $real = $rootContainer;
    $virtual = $real.cloneNode(false);
    $virtual.innerHTML = RootComponentInstance.render();
  } else {
    $real = $container;
    $virtual = createVirtualRoot(componentInstance.render());
  }

  reconciliation($virtual, $real);

  updateEventHandlers();
};

export default render;
