import axios from 'axios';
import { getOrganization } from '../state/index.js';

const storeOnServer = async () => {
  try {
    const payload = { organization: getOrganization() };
    const { data } = await axios.post('/api/organization', payload);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export default storeOnServer;
