const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // 유저 ID 참조
  name: { type: String, required: true },
});

module.exports = mongoose.model('Category', categorySchema);
