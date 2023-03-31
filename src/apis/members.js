import { axiosWithRetry, LocalStorage, ORGANIZATION_KEY } from '@/utils';
import { getInitialState } from '@/state';

const organizationStorage = new LocalStorage(ORGANIZATION_KEY);

export const addMemberOnServer = async (uid, member) => {
  await axiosWithRetry.post('/api/members', { uid, member });
};

export const addMemberOnLocal = member => {
  const organization = organizationStorage.getItem() ?? getInitialState().organization;
  organizationStorage.setItem({
    ...organization,
    members: [...organization.members, member],
  });
};

export const updateMemberOnServer = async (uid, member) => {
  await axiosWithRetry.patch(`/api/members/${uid}`, { member });
};

export const updateMemberOnLocal = member => {
  const organization = organizationStorage.getItem() ?? getInitialState().organization;
  organizationStorage.setItem({
    ...organization,
    members: organization.members.map(existingMember => (existingMember.id === member.id ? member : existingMember)),
  });
};

export const deleteMemberOnServer = async (uid, id) => {
  await axiosWithRetry.delete(`/api/members/${uid}`, { data: { id } });
};

export const deleteMemberOnLocal = id => {
  const organization = organizationStorage.getItem() ?? getInitialState().organization;
  organizationStorage.setItem({
    ...organization,
    members: organization.members.filter(member => member.id !== id),
  });
};
