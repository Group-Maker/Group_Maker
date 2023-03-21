import { axiosWithRetry } from '@/utils';

export const getUserInfo = async () => {
  const { data } = await axiosWithRetry.get('/auth');
  return data;
};

export const signUp = async payload => {
  await axiosWithRetry.post(`/auth/signup`, payload);
};

export const signIn = async payload => {
  const { data } = await axiosWithRetry.post(`/auth/signin`, payload);
  return data;
};

export const signOut = async () => {
  await axiosWithRetry.get('/auth/signout');
};

export const checkDuplicatedId = async userId => {
  const { data: isDuplicated } = await axiosWithRetry.post('/auth/userId', { userId });
  return isDuplicated;
};
