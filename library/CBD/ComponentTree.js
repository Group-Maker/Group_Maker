/* eslint-disable lines-between-class-members */
/* eslint-disable import/prefer-default-export */

import { subscribeEvents, unSubscribeEvents } from './eventHandler';

class ComponentNode {
  constructor(componentInstance, parentId) {
    this.component = componentInstance;
    this.parentId = parentId;
    this.children = [];
  }
}

export class ComponentTree {
  // 컴포넌트를 담아두는 객체
  // 탐색 없이 모든 객체에 바로 접근할 수 있다
  #components = {};
  // 컴포넌트 호출 순서를 관리하는 배열
  // 컴포넌트를 트리에 추가할 때 부모 컴포넌트를 확인할 수 있다
  #callStack = [];

  // 디버깅을 위해 임시로 사용할 접근자 프로퍼티
  get callStack() {
    return this.#callStack;
  }
  get components() {
    return this.#components;
  }

  pushToCallStack(componentId) {
    this.#callStack.push(componentId);
  }

  popCallStack() {
    this.#callStack.pop();
  }

  add(component) {
    const componentId = component.id;
    const parentId = this.#callStack.at(-1) || null;

    this.#components[componentId] = new ComponentNode(component, parentId);
    parentId && this.#components[parentId].children.push(componentId);
  }

  remove(componentId) {
    const { component, parentId, children } = this.#components[componentId];

    component.willUnmount?.();
    component.eventHandlers && unSubscribeEvents(component.eventHandlers);

    delete this.#components[componentId];
    if (this.#components[parentId]) {
      this.#components[parentId].children = this.#components[parentId].children.filter(id => id !== componentId);
    }

    children.forEach(childId => this.remove(childId));
  }

  update(component) {
    const { isMounted } = component;
    if (isMounted) {
      component.didUpdate?.();
    } else {
      component.didMount?.();
      component.eventHandlers && subscribeEvents(component.eventHandlers);
      component.isMounted = true;
    }
  }

  trav(componentId, callback) {
    if (!componentId || !this.#components[componentId]) {
      return;
    }
    console.log(`travling`, componentId);
    const { component, children } = this.#components[componentId];

    callback(component, componentId);
    children.forEach(childId => this.trav(childId, callback));
  }
}
