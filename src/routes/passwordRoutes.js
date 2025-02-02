const express = require('express');
const {
  sendCode,
  verifyCode,
  resetPassword,
  changePassword,
} = require('../controllers/passwordControllers');
const { resetTokenMiddleware } = require('../middlewares/TokenAuth');

const router = express.Router();

router.post('/reset/send-code', sendCode);
router.post('/reset/verify-code', verifyCode);
router.post('/reset', resetTokenMiddleware, resetPassword);
router.patch('/:userId/change', changePassword);

module.exports = router;
