// 해싱 방법을 어떻게 할까요?
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return await bcrypt.hash(password);
  //const salt = await bcrypt.genSalt(10);
  //return await bcrypt.hash(password, salt);
}

// 비밀번호 비교 함수
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };
