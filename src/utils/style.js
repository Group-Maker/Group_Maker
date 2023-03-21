/* eslint-disable import/prefer-default-export */

export const appendStyles = (element, style = {}) => {
  Object.entries(style).forEach(([property, value]) => {
    element.style[property] = typeof value === 'number' ? value + 'px' : value;
  });
};

export const formatTranslate3DCSS = (x = 0, y = 0, z = 0) => `translate3D(${x}px, ${y}px, ${z}px)`;
