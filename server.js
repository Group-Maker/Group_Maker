const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
// const users = require('./fake-data/users-data.js');
require('dotenv').config();

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
          id: 1,
          record: [
            [1, 17, 0, 16],
            [5, 14, 2],
            [10, 6, 7, 8],
            [4, 12, 15, 11],
            [9, 13, 3, 18],
          ],
        },
        {
          id: 2,
          record: [
            [4, 3, 13, 16],
            [0, 1, 7, 15],
            [2, 5, 10, 11],
            [6, 8, 9, 12, 14],
          ],
        },
        {
          id: 3,
          record: [
            [1, 2, 4],
            [3, 8, 5],
            [0, 11, 13],
            [6, 9, 12, 14],
            [7, 10, 15, 16],
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
          id: 1,
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

const addOrganization = (userid, organization) => {
  const user = findUserByUserid(userid);
  user.organization = organization;
};

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app = express();
const PORT = 5004;

app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(cookieParser());

const getAuthedUserId = req => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        return decoded.userid;
      }
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

app.get('/auth/check', (req, res) => {
  const authedUserId = getAuthedUserId(req);
  if (authedUserId) {
    const { name, organization } = findUserByUserid(authedUserId);
    // const { name, organization } = users.find(user => user.userid === authedUserId);

    return res.send(
      JSON.stringify({
        user: { name },
        organization,
      })
    );
  }
  res.send(JSON.stringify({ user: null }));
});

app.post('/auth/signin', (req, res) => {
  const { userid, password } = req.body;

  // 401 Unauthorized
  if (!userid || !password) {
    return res.status(401).send({ error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.' });
  }

  // const user = users.find(user => user.userid === userid && user.password === password);
  const user = findUser(userid, password);

  // 401 Unauthorized
  if (!user) {
    return res.status(401).send({ error: '등록되지 않은 사용자입니다.' });
  }

  const accessToken = jwt.sign({ userid }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  // 쿠키에 토큰 설정(http://expressjs.com/ko/api.html#res.cookie)
  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  // 로그인 성공
  res.send(
    JSON.stringify({
      user: {
        name: user.name,
      },
      organization: user.organization,
    })
  );
});

app.get('/auth/signout', (req, res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.send('clearCookie');
});

// TODO: 주소 이름 변경 필요
app.post('/auth/checkDuplicated', (req, res) => {
  const { inputId } = req.body;
  const existingUser = findUserByUserid(inputId);
  res.send(!!existingUser);
});

app.post('/auth/signup', (req, res) => {
  const { userid, name, password } = req.body;
  console.log(req.body);

  if (!userid || !name || !password) {
    return res.status(401).send({ error: '사용자 아이디 또는 이름 또는 패스워드가 전달되지 않았습니다.' });
  }

  createUser(userid, password, name);
});

app.post('/api/organization', (req, res) => {
  const authedUserId = getAuthedUserId(req);
  if (authedUserId) {
    const { organization } = req.body;
    addOrganization(authedUserId, organization);

    return res.send(JSON.stringify({ success: true }));
  }
  // JWT인증이 실패한 경우에 대한 처리 필요
  res.send({ error: '인증 실패' });
});

// 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
// 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http:/localhost:${PORT}`);
});
