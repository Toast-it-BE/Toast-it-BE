const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false, select: false }, // 데이터베이스에 저장하지 않음
  createdAt: { type: Date, default: Date.now },
});

// 저장하기 전에 confirmPassword 필드 제거
UserSchema.pre('save', function (next) {
  this.confirmPassword = undefined;
  next();
});

module.exports = mongoose.model('User', UserSchema);
