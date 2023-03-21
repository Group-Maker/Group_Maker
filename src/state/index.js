import { useGlobalState } from '@@/CBD';

const INITIAL_STATE = {
  isLoading: true,
  userId: null,
  user: null,
  uid: null,
  organization: {
    members: [],
    records: [],
  },
};

const [getGlobalState, setGlobalState] = useGlobalState(INITIAL_STATE);

const getInitialState = () => INITIAL_STATE;

const checkLoading = () => getGlobalState().isLoading;

const getUserId = () => getGlobalState().userId;
const getUser = () => getGlobalState().user;
const getUID = () => getGlobalState().uid;

const getOrganization = () => getGlobalState().organization;

const setUserAndOrganization = ({ userId, user, organization }) => {
  setGlobalState(prevState => ({
    ...prevState,
    userId,
    user,
    organization,
  }));
};

const generateNextId = arr => Math.max(...arr.map(item => item.id), -1) + 1;

// records

const getRecords = () => getGlobalState().organization.records;

const setRecords = records => {
  setGlobalState(prevState => ({
    ...prevState,
    organization: { ...prevState.organization, records },
  }));
};

const getRecordById = id => getRecords().find(record => record.id === id);

const addRecord = record => {
  const prevRecords = getRecords();
  const records = [...prevRecords, { id: generateNextId(prevRecords), record }];
  setRecords(records);
};

const removeRecord = id => {
  const records = getRecords().filter(record => record.id !== id);
  setRecords(records);
};

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

const getMemberById = id => getMembers().find(member => member.id === id);
const getMemberByName = name => getMembers().find(member => member.name === name);

const getMemberNameById = id => getMembers().find(member => member.id === id)?.name;

const getMemberIdByName = name => getMembers().find(member => member.name === name)?.id;

const checkDuplicatedName = name => getMemberIdByName(name) !== undefined;

const getActiveMembers = () => getMembers().filter(member => member.isActive);

const checkActiveMember = id => getMembers().find(member => member.id === id)?.isActive;

const checkMemberIncludedInRecords = id => getRecords().some(({ record }) => record.some(group => group.includes(id)));

const addMember = name => {
  const prevMembers = getMembers();
  const members = [...prevMembers, { id: generateNextId(prevMembers), name, isActive: true }];
  setMembers(members);
};

const updateMember = ({ id, name, isActive }) => {
  const members = getMembers().map(member => (member.id === id ? { ...member, name, isActive } : member));
  setMembers(members);
};

const inactivateMember = id => {
  const members = getMembers().map(member => (member.id === id ? { ...member, isActive: false } : member));
  setMembers(members);
};

const activateMember = id => {
  const members = getMembers().map(member => (member.id === id ? { ...member, isActive: true } : member));
  setMembers(members);
};

const removeMember = id => {
  const members = getMembers().filter(member => member.id !== id);
  setMembers(members);
};

export {
  getInitialState,
  checkLoading,
  getUID,
  getUserId,
  getUser,
  getOrganization,
  setUserAndOrganization,
  getRecords,
  getRecordById,
  addRecord,
  removeRecord,
  setGlobalState,
  getMembers,
  getMemberById,
  getMemberByName,
  getMemberNameById,
  getMemberIdByName,
  checkDuplicatedName,
  getActiveMembers,
  checkActiveMember,
  checkMemberIncludedInRecords,
  addMember,
  updateMember,
  inactivateMember,
  activateMember,
  removeMember,
};
export * from './onboarding';
