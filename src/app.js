const express = require('express');
const sampleRoutes = require('./routes/sampleRoutes.js');
const app = express();

app.use(express.json());

// Routes
app.use('/api/sample', sampleRoutes);

module.exports = app;
