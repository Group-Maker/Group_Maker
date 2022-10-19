import { useGlobalState } from '../../library/CBD/index.js';

const initialState = {
  isLoading: true,
  user: null,
  organization: {
    members: [],
    records: [],
  },
};

const [globalState, setGlobalState] = useGlobalState(initialState);

const isLoading = () => globalState.isLoading;
const setIsLoading = isLoading => {
  setGlobalState(prevState => ({
    ...prevState,
    isLoading,
  }));
};

const getUser = () => globalState.user;
const setUser = user => {
  setGlobalState(prevState => ({
    ...prevState,
    user,
  }));
};

const getOrganization = () => globalState.organization;

const setUserAndOrganization = ({ user, organization }) => {
  setGlobalState(prevState => ({
    ...prevState,
    user,
    organization,
  }));
};

export { isLoading, setIsLoading, getUser, setUser, getOrganization, setUserAndOrganization, setGlobalState };
