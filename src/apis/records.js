import { axiosWithRetry } from '@/utils';
import { LocalStorage, ORGANIZATION_KEY } from '@/utils/localStorage';

const organizationStorage = new LocalStorage(ORGANIZATION_KEY);

export const addRecordOnServer = async (uid, record) => {
  await axiosWithRetry.post('/api/records', { uid, record });
};

export const addRecordOnLocal = record => {
  const organization = organizationStorage.getItem() ?? getInitialState().organization;
  organizationStorage.setItem({
    ...organization,
    records: [...organization.records, record],
  });
};

export const deleteRecordOnServer = async (uid, id) => {
  await axiosWithRetry.delete(`/api/records/${uid}`, { data: { id } });
};

export const deleteRecordOnLocal = id => {
  const organization = organizationStorage.getItem() ?? getInitialState().organization;
  organizationStorage.setItem({
    ...organization,
    records: organization.records.filter(record => record.id !== id),
  });
};
