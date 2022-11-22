import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import users from './fake-data/users-data.js';
from('dotenv').config();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

const app = express();
const PORT = process.env.PORT || 5000;

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
  console.log(authedUserId);
  if (authedUserId) {
    const { name, organization } = users.findUserByUserid(authedUserId);
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
  const user = users.findUser(userid, password);

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
      user: { name: user.name },
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
  const existingUser = users.findUserByUserid(inputId);
  res.send(!!existingUser);
});

app.post('/auth/signup', (req, res) => {
  const { userid, name, password } = req.body;
  console.log(req.body);

  if (!userid || !name || !password) {
    return res.status(401).send({ error: '사용자 아이디 또는 이름 또는 패스워드가 전달되지 않았습니다.' });
  }

  users.createUser(userid, password, name);
});

app.post('/api/organization', (req, res) => {
  const authedUserId = getAuthedUserId(req);
  if (authedUserId) {
    const { organization } = req.body;
    users.addOrganization(authedUserId, organization);

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
