require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  db: {
    uri: process.env.URI,
  },
  jwtSecret: process.env.jwtSecret,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_KEY: process.env.GMAIL_APP_KEY,
};
