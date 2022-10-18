let users = [
  {
    userid: 'connecto1@gmail.com',
    password: '12341234',
    name: '커넥투 1기',
    organization: {
      members: [
        { id: 0, name: '강지승', isActive: true },
        { id: 1, name: '김경현', isActive: true },
        { id: 2, name: '김민석', isActive: true },
        { id: 3, name: '김은우', isActive: true },
        { id: 4, name: '김이주', isActive: true },
        { id: 5, name: '김채린', isActive: true },
        { id: 6, name: '김현진', isActive: true },
        { id: 7, name: '박윤하', isActive: true },
        { id: 8, name: '박지윤', isActive: true },
        { id: 9, name: '백남헌', isActive: true },
        { id: 10, name: '손재영', isActive: true },
        { id: 11, name: '신민경', isActive: true },
        { id: 12, name: '유은지', isActive: true },
        { id: 13, name: '이채련', isActive: true },
        { id: 14, name: '전희준', isActive: true },
        { id: 15, name: '조한', isActive: true },
        { id: 16, name: '최현정', isActive: true },
        { id: 17, name: '황영환', isActive: false },
        { id: 18, name: '김주민', isActive: false },
      ],
      records: [
        {
          id: 0,
          record: [
            [1, 17, 0, 16],
            [5, 14, 2],
            [10, 6, 7, 8],
            [4, 12, 15, 11],
            [9, 13, 3, 18],
          ],
        },
      ],
    },
  },
  {
    userid: 'test@test.com',
    password: 'asdfasdf',
    name: 'test',
    organization: {
      members: [
        { id: 0, name: 'Alice', isActive: true },
        { id: 1, name: 'Bob', isActive: true },
        { id: 2, name: 'Chris', isActive: true },
        { id: 3, name: 'David', isActive: true },
        { id: 4, name: 'Ellen', isActive: true },
        { id: 5, name: 'Frank', isActive: true },
        { id: 6, name: 'Grace', isActive: true },
        { id: 7, name: 'Hellena', isActive: true },
      ],
      records: [
        {
          id: 0,
          record: [
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7],
          ],
        },
      ],
    },
  },
];

const findUserByUserid = userid => users.find(user => user.userid === userid);

const findUser = (userid, password) => users.find(user => user.userid === userid && user.password === password);

const createUser = (userid, password, name) => {
  users = [...users, { userid, password, name, organization: { members: [], records: [] } }];
};

const getUsers = () => users;

module.exports = { createUser, findUserByUserid, findUser, getUsers };
