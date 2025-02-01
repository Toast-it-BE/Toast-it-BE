class UserLoginDTO {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.email || !this.password) {
      throw new Error('이메일과 비밀번호를 모두 입력해주세요.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('이메일의 형식이 올바르지 않습니다.');
    }
  }
}

module.exports = UserLoginDTO;
