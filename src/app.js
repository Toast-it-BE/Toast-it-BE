const express = require('express');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/AuthRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const memoRoutes = require('./routes/MemoRoutes');

const app = express();

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.get('/', (req, res) => {
  res.send('MongoDB 연결 확인 성공!');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memos', memoRoutes);

app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
