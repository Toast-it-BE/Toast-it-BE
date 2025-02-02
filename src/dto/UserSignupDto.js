class UserSignupDTO {
  constructor({ email, password, confirmPassword }) {
    this.email = email;
    this.password = password;
    this.confirm_password = confirmPassword;
  }

  validate() {
    if (!this.email || !this.password) {
      throw new Error('이메일과 비밀번호는 필수 입력값입니다.');
    }

    this.validateEmail();

    this.validatePassword();

    if (this.password !== this.confirm_password) {
      throw new Error('두 비밀번호가 일치하지 않습니다.');
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      throw new Error('이메일의 형식이 올바르지 않습니다.');
    }
  }

  validatePassword() {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      throw new Error(
        '비밀번호는 8자리 이상이어야 하며, 영어와 숫자를 반드시 포함해야 합니다.',
      );
    }
  }
}

module.exports = UserSignupDTO;
