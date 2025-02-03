const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passwordRoutes = require('./routes/passwordRoutes');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/AuthRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const memoRoutes = require('./routes/MemoRoutes');
const config = require('./config');

const app = express();
app.use(bodyParser.json());

// MongoDB 연결
connectDB();

// CORS 설정
app.use(cors());

app.use(
  cors({
    origin: 'http://localhost:8000', // 허용할 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // 허용할 메소드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
  }),
);

// 미들웨어 설정
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/auth/password', passwordRoutes);

app.listen(config.port, () => {
  console.log('서버가 http://localhost:8000 에서 실행 중입니다.');
});
