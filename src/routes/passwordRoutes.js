const express = require('express');
const {
  sendCode,
  verifyCode,
  resetPassword,
  changePassword,
} = require('../controllers/passwordController');
const {
  authMiddleware,
  resetTokenMiddleware,
} = require('../middlewares/TokenAuth');

const router = express.Router();

router.post('/reset/send-code', sendCode);
router.post('/reset/verify-code', verifyCode);
router.post('/reset', resetTokenMiddleware, resetPassword);
router.patch('/:userId/change', authMiddleware, changePassword);

module.exports = router;
