const app = require('./src/app.js');
const config = require('./src/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
