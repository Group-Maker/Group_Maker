import axios from 'axios';
import { getUserId, getOrganization } from '../state/index.js';

const storeOnServer = async () => {
  try {
    const payload = { userId: getUserId(), newOrganization: getOrganization() };
    await axios.post('/organization', payload);
  } catch (err) {
    console.error(err);
  }
};

export default storeOnServer;
