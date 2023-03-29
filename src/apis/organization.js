import { axiosWithRetry, LocalStorage, ORGANIZATION_KEY } from '@/utils';
import { getInitialState } from '@/state';

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
    const organization = organizationStorage.getItem() ?? getInitialState().organization;
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
