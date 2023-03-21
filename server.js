const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;
const whitelist = ['https://optimal-group-generator.com', 'https://www.optimal-group-generator.com'];

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (process.env.NODE_ENV === 'development' || whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    throw err;
  }

  const dbUsers = client.db('authDB').collection('users');

  app.get('/auth', async (req, res) => {
    const accessToken = req.headers.authorization || req.cookies.accessToken;
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      const { uid } = decoded;
      const { user, userId } = await dbUsers.findOne({ _id: new ObjectId(uid) });
      console.log(`😀 auth success!`);
      res.send({
        success: true,
        uid,
        user,
        userId,
      });
    } catch (err) {
      console.error('😱 auth failure..');
      return res.send({ success: false, message: 'Server Error: Invalid or not JWT' });
    }
  });

  // TODO: 주소 이름 RESTful하게 변경 필요
  app.post('/auth/userId', async (req, res) => {
    const { userId } = req.body;

    try {
      const user = await dbUsers.findOne({ userId });
      res.send(!!user);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ success: false, message: 'Server Error: Check user id' });
    }
  });

  app.post('/auth/signup', async (req, res) => {
    const { user, userId, password } = req.body;

    const organization = { members: [], records: [] };

    try {
      const hashedPW = await bcrypt.hash(password, 10);
      await dbUsers.insertOne({ user, userId, password: hashedPW, organization });

      console.log('signup success!');
      res.send('Success');
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ success: false, message: 'Server Error: Sign up faild' });
    }
  });

  app.post('/auth/signin', async (req, res) => {
    const { userId, password } = req.body;

    try {
      if (!userId || !password) {
        return res.status(401).send({ error: 'No username or password was passed.' });
      }

      const userData = await dbUsers.findOne({ userId });
      if (!userData) {
        return res.status(401).send({ error: 'Incorrect email or password.' });
      }
      const isCorrectPW = await bcrypt.compare(password, userData.password);
      if (!isCorrectPW) {
        return res.status(401).send({ error: 'Incorrect email or password.' });
      }

      const { _id, user, organization: org } = userData;

      const uid = _id.toString();
      const organization = org;

      const accessToken = jwt.sign({ uid }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
      });

      res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
        httpOnly: true,
        secure: true,
      });

      res.send({
        success: true,
        uid,
        user,
        userId,
        organization,
      });
    } catch (err) {
      console.error('signin error:', err);
      return res.status(500).send({ success: false, message: 'Server Error: Sign in faild' });
    }
  });

  app.get('/auth/signout', (req, res) => res.clearCookie('accessToken').end());

  app.get('/api/organization/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
      const data = await dbUsers.findOne({ _id: new ObjectId(uid) });
      const organization = data.organization;

      res.send({ success: true, organization });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Get organization faild' });
    }
  });

  app.patch('/api/organization/:uid', async (req, res) => {
    const { uid } = req.params;
    const { organization } = req.body;
    try {
      const updateResult = await dbUsers.updateOne({ _id: new ObjectId(uid) }, { $set: { organization } });
      updateResult.modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Update organization faild' });
      console.log('organization updated!');
    } catch {
      return res.status(500).send({ success: false, message: 'Server Error: Update organization faild' });
    }
  });

  app.post('/api/members', async (req, res) => {
    const { uid, member } = req.body;
    try {
      const { modifiedCount } = await dbUsers.updateOne(
        { _id: new ObjectId(uid) },
        { $push: { 'organization.members': member } }
      );
      modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Add member faild' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Add member faild' });
    }
  });

  app.patch('/api/members/:uid', async (req, res) => {
    const { uid } = req.params;
    const { member } = req.body;
    try {
      const { modifiedCount } = await dbUsers.updateOne(
        {
          _id: new ObjectId(uid),
        },
        {
          $set: {
            'organization.members.$[v]': member,
          },
        },
        {
          arrayFilters: [
            {
              'v.id': member.id,
            },
          ],
        }
      );
      modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Update member faild' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Update member faild' });
    }
  });

  app.delete('/api/members/:uid', async (req, res) => {
    const { uid } = req.params;
    const { id } = req.body;
    try {
      const { modifiedCount } = await dbUsers.updateOne(
        { _id: new ObjectId(uid) },
        { $pull: { 'organization.members': { id } } }
      );
      modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Delete member faild' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Delete member faild' });
    }
  });

  app.post('/api/records', async (req, res) => {
    const { uid, record } = req.body;
    try {
      const { modifiedCount } = await dbUsers.updateOne(
        { _id: new ObjectId(uid) },
        { $push: { 'organization.records': record } }
      );
      modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Add record faild' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Add record faild' });
    }
  });

  app.delete('/api/records/:uid', async (req, res) => {
    const { uid } = req.params;
    const { id } = req.body;
    try {
      const { modifiedCount } = await dbUsers.updateOne(
        { _id: new ObjectId(uid) },
        { $pull: { 'organization.records': { id } } }
      );
      modifiedCount
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'Server Error: Delete record faild' });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ success: false, message: 'Server Error: Delete record faild' });
    }
  });

  // 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
  // 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
