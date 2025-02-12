const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passwordRoutes = require('./routes/passwordRoutes');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/AuthRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const memoRoutes = require('./routes/MemoRoutes');
const config = require('./config');

const app = express();

// MongoDB 연결
connectDB();

app.use(
  cors({
    origin: ['https://www.toast-it.site', 'https://toast-it.site'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

app.use(express.json());
app.use(cookieParser());

// 테스트 라우트
app.get('/', (req, res) => {
  res.send('연결 성공!');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/auth/password', passwordRoutes);

app.listen(config.PORT, () => {
  console.log(`서버가 실행 중입니다. 포트: ${config.PORT}`);
});
