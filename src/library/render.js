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

    if ($vNode && $rNode) reconciliation($vNode, $rNode);
    if (!$vNode) $rNode.remove();
    if (!$rNode) $realNode.appendChild($vNode);
  }
};

let $realRoot = null;
let $virtualRoot = null;
let rootComponent = null;

const render = ($rootContainer, RootComponent) => {
  if ($rootContainer && RootComponent) {
    $realRoot = $rootContainer;
    $virtualRoot = $rootContainer.cloneNode(true);
    rootComponent = new RootComponent();
  }
  $virtualRoot.innerHTML = rootComponent.render();
  reconciliation($virtualRoot, $realRoot);
};

export default render;
