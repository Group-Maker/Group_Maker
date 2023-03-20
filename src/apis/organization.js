import { axiosWithRetry } from '@/utils';
import { LocalStorage, ORGANIZATION_KEY } from '@/utils/localStorage';

const organizationStorage = new LocalStorage(ORGANIZATION_KEY);

export const getOrganizationOnServer = async uid => {
  try {
    const { data } = await axiosWithRetry.get(`/api/organization/${uid}`);
    return data.organization;
  } catch (err) {
    return null;
  }
};
export const getOrganizationOnLocal = () => {
  try {
    const organization = organizationStorage.getItem();
    return organization;
  } catch (err) {
    return null;
  }
};

export const updateOrganizationOnServer = async (uid, organization) => {
  await axiosWithRetry.patch(`/api/organization/${uid}`, { organization });
};
export const updateOrganizationOnLocal = organization => {
  organizationStorage.setItem(organization);
};

export const addMemberOnServer = async (uid, member) => {
  await axiosWithRetry.post('/api/members', { uid, member });
};

export const addMemberOnLocal = member => {
  const organization = organizationStorage.getItem();
  organizationStorage.setItem({
    ...organization,
    members: [...organization.members, member],
  });
};

export const updateMemberOnServer = async (uid, member) => {
  await axiosWithRetry.patch(`/api/members/${uid}`, { member });
};

export const updateMemberOnLocal = member => {
  const organization = organizationStorage.getItem();
  organizationStorage.setItem({
    ...organization,
    members: organization.members.map(existingMember => (existingMember.id === member.id ? member : existingMember)),
  });
};

export const deleteMemberOnServer = async (uid, id) => {
  await axiosWithRetry.delete(`/api/members/${uid}`, { data: { id } });
};

export const deleteMemberOnLocal = id => {
  const organization = organizationStorage.getItem();
  organizationStorage.setItem({
    ...organization,
    members: organization.members.filter(member => member.id !== id),
  });
};
