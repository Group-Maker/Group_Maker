import { ComponentTree } from './ComponentTree.js';

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

const createVirtualRoot = DOMStr => {
  const $temp = document.createElement('div');
  $temp.innerHTML = DOMStr;
  if ($temp.childElementCount > 1) {
    throw new Error('컴포넌트는 반드시 하나의 요소로 감싸야 합니다!');
  }
  return $temp.firstElementChild;
};

let isInit = true;
let $realRoot = null;
let $virtualRoot = null;
let RootComponentInstance = null;
const componentTree = new ComponentTree();

const render = ($container, componentInstance) => {
  let $real;
  let $virtual;
  let $newVirtual;
  const currentRootId = (componentInstance ?? RootComponentInstance).id;

  if (isInit || !$container) {
    if (isInit) {
      $realRoot = $container;
      $virtualRoot = $realRoot.cloneNode(false);
      RootComponentInstance = componentInstance;
      isInit = false;
    }
    $real = $realRoot;
    $virtual = $virtualRoot;
    $newVirtual = $virtual.cloneNode(false);
    $newVirtual.innerHTML = RootComponentInstance.render();
  } else {
    $real = $container;
    $virtual = $virtualRoot.querySelector(`[data-component-id="${currentRootId}"]`);
    $newVirtual = createVirtualRoot(componentInstance.render());
  }
  // console.log('----------------render phase---------------------');

  componentTree.trav(currentRootId, (_, componentId) => {
    const isRemoved =
      $newVirtual.dataset.componentId !== componentId &&
      !$newVirtual.querySelector(`[data-component-id="${componentId}"]`);
    if (isRemoved) {
      componentTree.remove(componentId);
    }
  });

  // virtualDOM 업데이트
  $virtual.innerHTML = $newVirtual.innerHTML;

  // 브라우저에 렌더링
  reconciliation($newVirtual, $real);
  // console.log('----------------commit phase---------------------');

  // 컴포넌트 트리를 순회하며 업데이트한다 - 현재 컴포넌트 트리와 DOM트리는 동기화된 상태이다
  // 처음 생성된 컴포넌트는 didMount함수를 호출하고 이벤트 핸들러를 등록한다
  // 나머지 컴포넌트는 didUpdate를 호출한다
  componentTree.trav(currentRootId, componentTree.update);
  // console.log('-------------------------------------');
};

export { render, componentTree };
