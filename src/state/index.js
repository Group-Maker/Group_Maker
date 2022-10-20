import { useGlobalState } from '../../library/CBD/index.js';

const initialState = {
  isLoading: true,
  user: null,
  organization: {
    members: [],
    records: [],
  },
};

const [getGlobalState, setGlobalState] = useGlobalState(initialState);

const getInitialState = () => initialState;

const isLoading = () => getGlobalState().isLoading;
const setIsLoading = isLoading => {
  setGlobalState(prevState => ({
    ...prevState,
    isLoading,
  }));
};

const getUser = () => getGlobalState().user;
const setUser = user => {
  setGlobalState(prevState => ({
    ...prevState,
    user,
  }));
};

const setUserAndOrganization = ({ user, organization }) => {
  setGlobalState(prevState => ({
    ...prevState,
    user,
    organization,
  }));
};

// organization

const getOrganization = () => getGlobalState().organization;

const generateNextId = arr => Math.max(...arr.map(item => item.id), -1) + 1;

// members

const getMembers = () => getGlobalState().organization.members;
const setMembers = members => {
  setGlobalState(prevState => ({
    ...prevState,
    organization: {
      ...prevState.organization,
      members,
    },
  }));
};

const getMembersLength = () => getMembers().length;
const getMemberIds = () => getMembers().map(member => member.id);
const getMemberNameById = id => getMembers().find(member => member.id === id)?.name;

const getActiveMembers = () => getMembers().filter(member => member.isActive);
const getActiveMemberIds = () => getActiveMembers().map(member => member.id);
const getActiveMembersLength = () => getActiveMembers().length;

const isDuplicatedMemberName = name => getMembers().find(member => member.name === name) !== undefined;

const addMember = name => {
  const prevMembers = getMembers();
  const members = [...prevMembers, { id: generateNextId(prevMembers), name, isActive: true }];
  setMembers(members);
};

const updateMember = ({ id, name }) => {
  const members = getMembers().map(member => (member.id === id ? { ...member, name } : member));
  setMembers(members);
};

const removeMember = id => {
  const members = getMembers().map(member => (member.id === id ? { ...member, isActive: false } : member));
  setMembers(members);
};

// records

const getRecords = () => getGlobalState().organization.records;
const setRecords = records => {
  setGlobalState(prevState => ({
    ...prevState,
    organization: { ...prevState.organization, records },
  }));
};

const addRecord = record => {
  const prevRecords = getRecords();
  const records = [...prevRecords, { id: generateNextId(prevRecords), record }];
  setRecords(records);
};

const removeRecord = id => {
  const records = getRecords().filter(record => record.id !== id);
  setRecords(records);
};

export {
  getInitialState,
  isLoading,
  setIsLoading,
  getUser,
  setUser,
  setUserAndOrganization,
  getOrganization,
  getMembers,
  getMembersLength,
  getMemberIds,
  getMemberNameById,
  getActiveMembers,
  getActiveMemberIds,
  getActiveMembersLength,
  isDuplicatedMemberName,
  addMember,
  updateMember,
  removeMember,
  getRecords,
  addRecord,
  removeRecord,
  setGlobalState,
};
