const express = require('express');
const bodyParser = require('body-parser');
const passwordRoutes = require('./routes/passwordRoutes');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/AuthRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const memoRoutes = require('./routes/MemoRoutes');

const app = express();
app.use(bodyParser.json());

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/auth/password', passwordRoutes);

app.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
});
