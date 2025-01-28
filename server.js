const app = require('./src/app.js');
const config = require('./src/config');

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});