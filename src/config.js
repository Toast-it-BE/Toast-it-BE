require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000, // 기본값 3000
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  apiKey: process.env.API_KEY,
};
