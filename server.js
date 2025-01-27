const express = require('express');
const bodyParser = require('body-parser');

const app = express(); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//const PORT = config.port;

//app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}`);
//});