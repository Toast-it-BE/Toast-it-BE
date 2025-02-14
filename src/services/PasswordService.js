const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const { sendRecoveryCode } = require('../middlewares/sendEmail');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const UserSignupDTO = require('../dto/UserSignupDto');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');

class PasswordService {
  static verificationData = {};

  // 비밀번호 복구 코드 발송
  static async sendRecoveryCode(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('해당 이메일로 가입된 사용자가 없습니다.', 404);
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '5m' });
    this.verificationData[email] = { code: recoveryCode, token };

    await sendRecoveryCode(email, recoveryCode);

    return {
      message: '복구 코드가 이메일로 발송되었습니다.',
      resetToken: token,
    };
  }

  // 복구 코드 검증
  static async verifyRecoveryCode(email, code) {
    const storedData = this.verificationData[email];

    if (!storedData) {
      throw new ValidationError(
        '인증 코드가 만료되었거나 존재하지 않습니다.',
        400,
      );
    }

    try {
      jwt.verify(storedData.token, config.JWT_SECRET);
    } catch (error) {
      throw new AuthError('인증 코드가 만료되었습니다.', 401);
    }

    if (storedData.code !== Number(code)) {
      throw new ValidationError('인증 코드가 일치하지 않습니다.', 400);
    }

    const newToken = jwt.sign({ email }, config.JWT_SECRET, {
      expiresIn: '1h',
    });
    delete this.verificationData[email];

    return { message: '인증이 완료되었습니다.', token: newToken };
  }

  // 비밀번호 재설정
  static async resetPassword(user, newPassword, confirmPassword) {
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.', 404);
    }
    const tempDTO = new UserSignupDTO({ password: newPassword });
    tempDTO.validatePassword();

    if (
      !newPassword ||
      !confirmPassword ||
      newPassword.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      throw new ValidationError('비밀번호를 입력해주세요.', 400);
    }

    if (newPassword !== confirmPassword) {
      throw new ValidationError('두 비밀번호가 일치하지 않습니다.', 400);
    }

    const updatedUser = existingUser;
    updatedUser.password = await hashPassword(newPassword);
    await updatedUser.save();

    return { message: '비밀번호가 설정되었습니다.' };
  }

  // 비밀번호 변경
  static async changePassword(
    token,
    currentPassword,
    newPassword,
    confirmPassword,
  ) {
    if (!token) {
      throw new AuthError('인증 토큰이 필요합니다.', 401);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다.', 404);
    }

    if (!(await comparePassword(currentPassword, user.password))) {
      throw new AuthError('현재 비밀번호가 일치하지 않습니다.', 401);
    }

    const tempDTO = new UserSignupDTO({ password: newPassword });
    tempDTO.validatePassword();

    if (newPassword !== confirmPassword) {
      throw new ValidationError(
        '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
        400,
      );
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}

module.exports = PasswordService;
