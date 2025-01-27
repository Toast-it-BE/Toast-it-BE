const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: '접근 제한. 토큰이 제공되지 않았습니다.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: '유효하지 않거나 만료된 토큰입니다.',
      });
    }
    req.user = decoded; // 디코딩된 사용자 정보 저장
    next();
  });
}

module.exports = authenticateToken;
