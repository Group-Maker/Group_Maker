/* eslint-disable import/prefer-default-export */

export const appendStyles = (element, style = {}) => {
  Object.entries(style).forEach(([property, value]) => {
    element.style[property] = value;
  });
};
