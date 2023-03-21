/* eslint-disable import/prefer-default-export */
const MAIN_TITLE = 'OPTIMAL GROUP MAKER';

export const setPageTitle = () => {
  const $title = document.querySelector('title');
  const subtitle = document.querySelector('h2')?.textContent;

  const pageTitle = subtitle ? `${subtitle} - ${MAIN_TITLE}` : MAIN_TITLE;

  $title.textContent = pageTitle;
};
