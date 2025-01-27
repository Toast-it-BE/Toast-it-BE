const express = require('express');
const { sendCode, verifyCode , resetPassword, changePassword } = require('../controllers/passwordControllers');
const router = express.Router();

router.post('/reset/send-code', sendCode);
router.post('/reset/verify-code', verifyCode);
router.post('/reset', resetPassword);
router.patch('/change', changePassword);

module.exports = router;