import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 코드 검증 및 JWT 발행
const generateToken = async (email, receivedCode, actualCode) => {
  const token = jwt.sign(
    { user : email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;  
};

const auth = async (email, receivedCode, actualCode) => {
  const key = process.env.SECRET_KEY;
  // 인증 완료
  try {
    req.decoded = jwt.verify(req.headers.authorization, key);
    return res.status(200).json({
      message:"코드가 유효합니다.",
      token : token
    })
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      return res.status(410).json({
        code: 410,
        message: "코드가 만료되었습니다.",
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        code: 400,
        message: "코드가 일치하지 않습니다.",
      });
    }
  }
};

module.exports = { generateToken , auth };