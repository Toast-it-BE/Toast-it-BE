const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { sendRecoveryCode } = require('../middlewares/sendEmail');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const UserSignupDTO = require('../dto/UserSignupDto');

class PasswordService {
  constructor() {
    if (!PasswordService.verificationData) {
      PasswordService.verificationData = {};
    }
  }

  static async sendRecoveryCode(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('해당 이메일로 가입된 사용자가 없습니다.');
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '5m' });
    this.verificationData[email] = { code: recoveryCode, token };

    await sendRecoveryCode(email, recoveryCode);

    return {
      message: '복구 코드가 이메일로 발송되었습니다.',
      resetToken: token,
    };
  }

  static async verifyRecoveryCode(email, code) {
    const storedData = this.verificationData[email];

    if (!storedData) {
      throw new Error('인증 코드가 만료되었거나 존재하지 않습니다.');
    }

    try {
      jwt.verify(storedData.token, config.jwtSecret);
    } catch (error) {
      throw new Error('인증 코드가 만료되었습니다.');
    }

    if (storedData.code !== Number(code)) {
      throw new Error('인증 코드가 일치하지 않습니다.');
    }

    const newToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
    delete this.verificationData[email];

    return { message: '인증이 완료되었습니다.', token: newToken };
  }

  static async resetPassword(user, newPassword, confirmPassword) {
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    const tempDTO = new UserSignupDTO({ password: newPassword });
    tempDTO.validatePassword();

    if (newPassword !== confirmPassword) {
      throw new Error('두 비밀번호가 일치하지 않습니다.');
    }

    const updatedUser = existingUser;
    updatedUser.password = await hashPassword(newPassword);
    await updatedUser.save();

    return { message: '비밀번호가 설정되었습니다.' };
  }

  static async changePassword(
    token,
    currentPassword,
    newPassword,
    confirmPassword,
  ) {
    if (!token) {
      throw new Error('인증 토큰이 필요합니다.');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (!comparePassword(currentPassword, user.password)) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }

    const tempDTO = new UserSignupDTO({ password: newPassword });
    tempDTO.validatePassword();

    if (newPassword !== confirmPassword) {
      throw new Error('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}

// 싱글톤 인스턴스 생성 (필요시 여러 컨트롤러에서 동일한 인스턴스 사용 가능)
module.exports = PasswordService;
