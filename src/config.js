require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  db: {
    uri: process.env.URI,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_KEY: process.env.GMAIL_APP_KEY,
};
