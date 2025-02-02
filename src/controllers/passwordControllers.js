const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { sendRecoveryCode } = require('../middlewares/sendEmail');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const UserSignupDTO = require('../dto/UserSignupDto');

const verificationData = {};

// 복구코드 발송
const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    // 사용자가 존재하는지 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: '해당 이메일로 가입된 사용자가 없습니다.' });
    }

    // 복구 코드 생성 및 JWT 토큰 생성 (5분 만료)
    const recoveryCode = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '5m' });
    verificationData[email] = { code: recoveryCode, token };

    // 이메일 발송
    await sendRecoveryCode(email, recoveryCode);
    return res.status(200).json({
      message: '복구 코드가 이메일로 발송되었습니다.',
      resetToken: token,
    });
  } catch (error) {
    console.error('복구 코드 발송 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 복구 코드 검증
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const storedData = verificationData[email];

    if (!storedData) {
      return res
        .status(401)
        .json({ message: '인증 코드가 만료되었거나 존재하지 않습니다.' });
    }

    // JWT 만료 여부 확인
    try {
      jwt.verify(storedData.token, config.jwtSecret);
    } catch (error) {
      return res.status(401).json({ message: '인증 코드가 만료되었습니다.' });
    }

    // 인증 코드 확인
    if (storedData.code !== Number(code)) {
      return res
        .status(400)
        .json({ message: '인증 코드가 일치하지 않습니다.' });
    }

    // 인증 성공 후 새 토큰 발급 (1시간 유효)
    const newToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
    delete verificationData[email]; // 인증 성공 후 기존 코드 삭제

    return res
      .status(200)
      .json({ message: '인증이 완료되었습니다.', token: newToken });
  } catch (error) {
    console.error('복구 코드 검증 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 비밀번호 재설정
const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { user } = req;

  // 비밀번호 형식 검사
  const tempDTO = new UserSignupDTO({ password: newPassword });
  tempDTO.validatePassword();

  // 비밀번호 일치 검사
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: '두 비밀번호가 일치하지 않습니다.' });
  }

  try {
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: '비밀번호가 설정되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 비밀번호 변경
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 현재 비밀번호 검증
    if (!comparePassword(currentPassword, user.password)) {
      return res
        .status(401)
        .json({ message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 검증
    const tempDTO = new UserSignupDTO({ password: newPassword });
    tempDTO.validatePassword();

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 변경
    user.password = await hashPassword(newPassword);
    await user.save();

    return res
      .status(200)
      .json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = { sendCode, verifyCode, resetPassword, changePassword };
