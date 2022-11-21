import axios from 'axios';
import { getuserId, getOrganization } from '../state/index.js';

const storeOnServer = async () => {
  try {
    const payload = { userId: getuserId(), newOrganization: getOrganization() };
    await axios.post('/organization', payload);
  } catch (err) {
    console.error(err);
  }
};

export default storeOnServer;
