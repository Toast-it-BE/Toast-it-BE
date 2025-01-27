const express = require('express');
const {
  signup,
  login,
  refreshAccessToken,
  logout,
} = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken); // accessToken 갱신
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: '이 요청은 인증된 사용자만 접근할 수 있습니다.',
    user: req.user,
  });
});

module.exports = router;
