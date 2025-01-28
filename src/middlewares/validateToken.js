import jwt from "jsonwebtoken";
const User = require('../models/User');

const validateToken = async(req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer 토큰 추출

  if (!token) {
    return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  // 토큰 검증
  try {
    // JWT 토큰 검증
    const decoded = jwt.verify(token, 'secret-key'); 
    
    const user = await User.findById(decoded.userId); 
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    req.user = user;
    next(); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};


module.exports =  validateToken ;