/* eslint-disable import/prefer-default-export */
import { ONBOARDING_PLACEMENT } from '@/components';
import { ROUTE_PATH } from './routes';

export const ONBOARDING_ID = {
  MEMBERS_PAGE: 'membersPage',
  RECORDS_PAGE: 'recordsPage',
  NEW_GROUP_PAGE: 'newGroupPage',
  OPTIMAL_GENERATE: 'optimalGenerate',
  HELP: 'help',
};

export const ONBOARDING_STEPS = [
  {
    title: 'Welcome to<br/>Optimal Group Generator!',
    content: "Let's begin super simple and easy tutorials.",
    target: `[data-onboarding-id="${ONBOARDING_ID.ADD_MEMBER}"]`,
  },
  {
    content: 'Add, delete and rename your members here.',
    target: `[data-onboarding-id="${ONBOARDING_ID.MEMBERS_PAGE}"]`,
    placement: ONBOARDING_PLACEMENT.RIGHT,
    page: ROUTE_PATH.members,
  },
  {
    content: 'Check and remove previous records here.',
    target: `[data-onboarding-id="${ONBOARDING_ID.RECORDS_PAGE}"]`,
    placement: ONBOARDING_PLACEMENT.RIGHT,
    page: ROUTE_PATH.records,
  },
  {
    content: 'Generate new groups here.',
    target: `[data-onboarding-id="${ONBOARDING_ID.NEW_GROUP_PAGE}"]`,
    placement: ONBOARDING_PLACEMENT.RIGHT,
    page: ROUTE_PATH.newgroup,
  },
  {
    content: 'Be with new people!<br />We care all about complicated calculations.',
    target: `[data-onboarding-id="${ONBOARDING_ID.OPTIMAL_GENERATE}"]`,
    placement: ONBOARDING_PLACEMENT.TOP_LEFT,
    page: ROUTE_PATH.newgroup,
  },
  {
    title: "That's all!",
    content: 'Now manage your groups with Optimal Group Generator.',
    locale: {
      next: 'Finish',
    },
    page: ROUTE_PATH.members,
  },
  {
    content: 'Click this button if you need tutorial again.',
    locale: {
      finish: 'OK',
    },
    target: `[data-onboarding-id="${ONBOARDING_ID.HELP}"]`,
    placement: ONBOARDING_PLACEMENT.TOP_RIGHT,
    hideBackButton: true,
    hideCloseButton: true,
    page: ROUTE_PATH.members,
  },
];
