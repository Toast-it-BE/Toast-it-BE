const express = require('express');
const mongoose = require('mongoose');
const sampleRoutes = require('./routes/sampleRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

// 로컬 MongoDB URI
const dbURI = 'mongodb://localhost:27017/toast_it';

mongoose
  .connect(dbURI)
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch(err => {
    console.error('MongoDB 연결 실패:', err);
  });

const app = express();

app.use(express.json());

// Routes
app.use('/api/sample', sampleRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
