const express = require('express');
const path = require('path');

const app = express();
const port = 5004;

app.use(express.static(__dirname));

app.get('/user', (req, res) => {
  res.send(JSON.stringify({ userType: 'gueeeeeest' }));
});

// 이름이 data가 뭐냐!
app.get('/api/data', (req, res) => {
  const data = {
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
      [
        [1, 17, 0, 16],
        [5, 14, 2],
        [10, 6, 7, 8],
        [4, 12, 15, 11],
        [9, 13, 3, 18],
      ],
    ],
  };
  res.send(JSON.stringify(data));
});

// 브라우저 새로고침을 위한 처리 (다른 route가 존재하는 경우 맨 아래에 위치해야 한다)
// 브라우저 새로고침 시 서버는 index.html을 전달하고 클라이언트는 window.location.pathname를 참조해 다시 라우팅한다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http:/localhost:${port}`);
});
