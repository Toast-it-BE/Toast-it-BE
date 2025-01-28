const express = require('express');
const bodyParser = require('body-parser');
const passwordRoutes = require('./routes/passwordRoutes.js');

const app = express();
app.use(bodyParser.json());


//라우터
app.use('/api/auth/password', passwordRoutes);

module.exports = app;