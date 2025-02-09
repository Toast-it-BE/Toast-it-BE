const express = require('express');
const cors = require('cors');
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
    origin: ['https://www.toast-it.site', 'https://toast-it.site'], // 허용할 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'], // 허용할 메소드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
  }),
);

app.use(express.json());

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
