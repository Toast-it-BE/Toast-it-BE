const bcrypt = require('bcrypt');

// 복구코드 발송
const sendCode = async(req, res) => {
  const { email } = req.body;

  // 이메일 형식 검사
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  if (!validateEmail(email)) {
      return res.status(400).json({ message: '이메일 형식이 올바르지 않습니다.' });
  }

  // 해당 이메일로 가입된 정보가 있는지 확인
  if (!email) {
      return res.status(404).json({ message: '해당 이메일로 가입된 정보가 없습니다.' });
  }

  // 이메일 발송
  code = generateRandomCode(6); // 6자리 랜덤 코드 생성
  const emailSent = await sendRecoveryCode(email, code);
  if (emailSent) {
      return res.status(200).json({ message: '복구 코드가 이메일로 발송되었습니다.' });
      //code 저장
  } else {
      return res.status(500).json({ message: '이메일 발송에 실패했습니다.' });
  }
};



//복구 코드 검증
const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const response = await verifyCodeAndGenerateToken( email, code, recoveryCode);

  //코드 만료 확인
  const token = response.token; 
  const tokenVerification = verifyToken(token);
  console.log(tokenVerification);

  //코드 일치 확인
  if (emailSent) {
    return res.status(200).json({
      "message": "코드가 유효합니다.",
      "token": token
    });
  }else{
    return res.status(200).json({ "message": "코드가 일치하지 않습니다."});
  }
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
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "두 비밀번호가 일치하지 않습니다." });
  }

  try {
    const hashedPassword = hash(newPassword);
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
  const user = req.user;

  // 현재 비밀번호 검증
  if(!comparePassword(currentPassword, user.password)){
    return res.status(401).json({ message: '현재 비밀번호가 일치하지 않습니다.' });
  }

  //비밀번호 형식 검사
  function validatePassword(newPassword){
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(newPassword);
  }
  if (!validatePassword(newPassword) || !newPassword) {
     return res.status(400).json({ message: '유효한 형식의 비밀번호가 아닙니다.' });
  }
    
  // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "두 비밀번호가 일치하지 않습니다." });
  }

  try {
    const hashedPassword = hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }

};


module.exports = { sendCode, verifyCode, resetPassword, changePassword};