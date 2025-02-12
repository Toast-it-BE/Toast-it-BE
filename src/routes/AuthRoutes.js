const express = require('express');

const router = express.Router();
const userController = require('../controllers/AuthController');
const { authMiddleware } = require('../middlewares/TokenAuth');

// 이메일 가입 여부 확인
router.post('/check-email', userController.checkEmailExists);

// 일반 회원가입
router.post('/signup', userController.signup);

// 일반 로그인
router.post('/login', userController.login);

// 카카오 회원가입
router.post('/signup/kakao', userController.kakaoSignup);

// 카카오 엑세스 토큰 요청
router.get('/signup/kakao', userController.getKakaoAccessToken);

// 카카오 로그인
router.post('/login/kakao', userController.kakaoLogin);

// 자동 로그인
router.get('/restore', userController.restore);

// 일반 로그아웃
router.post('/logout', userController.logout);

// 카카오 로그아웃
router.post('/logout/kakao', userController.kakaoLogout);

// 회원 탈퇴
router.delete('/delete', authMiddleware, userController.deleteUser);

module.exports = router;
