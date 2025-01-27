const express = require('express');
const bodyParser = require('body-parser');
const passwordRoutes = require('./routes/passwordRoutes.js');

const app = express();
app.use(bodyParser.json());


//라우터
app.use('/api/auth/password', passwordRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});