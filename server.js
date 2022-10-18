const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const users = require('./fake-data/users-data.js');
require('dotenv').config();

const app = express();
const PORT = 5004;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(cookieParser());

app.get('/auth/check', (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const { organization } = users.findUserByUserid(decoded.userid);
        res.send(JSON.stringify({ isSignedIn: true, organization }));
      }
    }
    res.send(JSON.stringify({ isSignedIn: false }));
  } catch (error) {
    console.log(error);
  }
});

app.post('/auth/signin', (req, res) => {
  const { userid, password } = req.body;

  // 401 Unauthorized
  if (!userid || !password) {
    return res.status(401).send({ error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.' });
  }

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
  res.send({ userid, username: user.name, organization: user.organization });
});

app.post('/auth/checkDuplicated', (req, res) => {
  const { inputId } = req.body;
  const existingUser = users.findUserByUserid(inputId);
  res.send(!!existingUser);
});

app.post('/auth/signup', (req, res) => {
  const { userid, username, password } = req.body;

  if (!userid || !username || !password) {
    return res.status(401).send({ error: '사용자 아이디 또는 이름 또는 패스워드가 전달되지 않았습니다.' });
  }

  users.createUser(userid, password, username);
});

// app.post('/auth/signout', (_, res) => res.clearCookie('accessToken'));

// 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
// 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http:/localhost:${PORT}`);
});
