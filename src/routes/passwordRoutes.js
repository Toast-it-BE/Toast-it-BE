const express = require('express');
const { sendCode, verifyCode , resetPassword, changePassword } = require('../controllers/passwordControllers');
const validateToken = require('../middlewares/validateToken');
const router = express.Router();

router.post('/reset/send-code', sendCode);
router.post('/reset/verify-code', verifyCode);
router.post('/reset', validateToken, resetPassword);
router.patch('/:userId/change', changePassword);

module.exports = router;