const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const cors = require('cors');

const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
  app.use(connectLiveReload());
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'https://group-maker-vanillajs.netlify.app', credentials: true }));

MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    throw err;
  }

  const dbUsers = client.db('authDB').collection('users');

  app.get('/auth', (req, res) => {
    const accessToken = req.headers.authorization || req.cookies.accessToken;

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      const { user, userId } = decoded;
      const { organization } = dbUsers.findOne({ userId });
      console.log(`😀 auth success! userId: ${userId}`);
      res.send({ success: true, user, userId, organization: JSON.parse(organization) });
    } catch {
      console.error('😱 auth failure..');
      res.send({ success: false });
    }
  });

  app.get('/auth/signout', (req, res) => res.clearCookie('accessToken').end());

  // TODO: 주소 이름 RESTful하게 변경 필요
  app.post('/auth/userId', (req, res) => {
    const { userId } = req.body;
    const user = dbUsers.findOne({ userId });
    res.send(!!user);
  });

  app.post('/auth/signup', (req, res) => {
    const { user, userId, password } = req.body;

    const organization = JSON.stringify({ members: [], records: [] });

    try {
      dbUsers.insertOne({ user, userId, password, organization });
      console.log('signup success!');
      res.send('Success');
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  });

  app.post('/auth/signin', async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(401).send({ error: 'No username or password was passed.' });
    }

    const user = await dbUsers.findOne({ userId });

    if (!user) {
      return res.status(401).send({ error: 'Incorrect email or password.' });
    }

    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1d',
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });

    res.send({
      user,
      userId,
      organization: JSON.parse(user.organization),
    });
  });

  app.post('/organization', async (req, res) => {
    const { userId, newOrganization } = req.body;
    try {
      await dbUsers.updateOne({ userId }, { $set: { organization: JSON.stringify(newOrganization) } });
      console.log('organization updated!');
    } catch {
      res.send({ error: 'organization update failed' });
    }
  });

  // 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
  // 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http:/localhost:${PORT}`);
  });
});
