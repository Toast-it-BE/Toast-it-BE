/*
const express = require('express');
const sampleRoutes = require('./routes/sampleRoutes.js');
const app = express();

app.use(express.json());

// Routes
app.use('/api/sample', sampleRoutes);

module.exports = app;
*/

const express = require('express');
const bodyParser = require('body-parser');
const recoveryRoutes = require('./routes/recovery');

const app = express();
const port = 3000;

// Middleware 설정
app.use(bodyParser.json());

// 라우트 설정
app.use('/recovery', recoveryRoutes);

// 서버 실행
app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});