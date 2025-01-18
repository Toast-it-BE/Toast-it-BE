const express = require('express');
const bodyParser = require('body-parser');
const memoRoutes = require('./routes/memoRoutes.js');

const app = express(); // express로 app을 생성
app.use(bodyParser.json());
app.use('/api', memoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//const PORT = config.port;

//app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}`);
//});
