const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, config.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyAccessToken = token => {
  return new Promise(resolve => {
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ JWT Verification Failed:', err.message);
        return resolve(null); // ✅ 토큰이 유효하지 않으면 `null` 반환
      }
      return resolve(decoded);
    });
  });
};

module.exports = { generateAccessToken, verifyAccessToken };
