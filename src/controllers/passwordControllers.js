const { User } = require('../models');
const { sendRecoveryCode } = require("../middlewares/sendEmail.js");
const jwt = require("jsonwebtoken");


const verificationData = {};


// 복구코드 발송
const sendCode = async(req, res) => {
  const { email } = req.body;
  const user = await User.findUnique({ where: { email }});
  
  // 이메일 형식 검사
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
  }
  
  //JWT 토큰 생성
  const recoveryCode = Math.floor(100000 + Math.random() * 900000);
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "10m" });
  verificationData[email] = { code: recoveryCode, token };

  // 해당 이메일로 가입된 정보가 있는지 확인
  if (!user) {
    return res.status(404).json({ message: '해당 이메일로 가입된 정보가 없습니다.' });
  } else{
    // 이메일 발송
    try {
      await sendRecoveryCode(email, recoveryCode); 
      return res.status(200).json({ message: '복구 코드가 이메일로 발송되었습니다.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: '이메일 발송에 실패했습니다.' });
    }
  }
};



//복구 코드 검증
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const storedData = verificationData[email];
  const { token, code: storedCode } = storedData;
  
  //코드 만료 확인
  try {
    jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return res.status(401).json({ message: "코드가 만료되었습니다." });
  }

  //코드 일치 확인
  if (storedCode !== parseInt(code)) {
    return res.status(400).json({ "message": "코드가 일치하지 않습니다."});
  }
  
  //인증 성공
  const newToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  delete verificationData[email];
  return res.status(200).json({ message: "코드가 유효합니다.", token: newToken });
};



//비밀번호 재설정
const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const user = req.user;

  //비밀번호 형식 검사
  function validatePassword(newPassword){
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(newPassword);
  }
  if (!validatePassword(newPassword) || !newPassword) {
    return res.status(400).json({ message: '비밀번호는 8자 이상으로 영문과 숫자를 조합해야 합니다.' });
  }

  //비밀번호 일치 검사
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "두 비밀번호가 일치하지 않습니다." });
  }

  try {
    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: '비밀번호가 설정되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};



//비밀번호 변경
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers.authorization.split(' ')[1]; 
  
  try {
    const decoded = jwt.verify(token, 'secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 현재 비밀번호 검증
    if (!comparePassword(currentPassword, user.password)) {
      return res.status(401).json({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    //비밀번호 형식 검사
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if(!passwordRegex.test(newPassword) || !newPassword){
      return res.status(400).json({ message: '유효한 형식의 비밀번호가 아닙니다.' });
    }
    
    // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "두 비밀번호가 일치하지 않습니다." });
    }
    
    //비밀번호 변경
    const hashedPassword = hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save()
    return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }

};


module.exports = { sendCode, verifyCode, resetPassword, changePassword};