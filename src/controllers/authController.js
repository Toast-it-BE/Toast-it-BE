const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ACCESS_TOKEN_EXPIRES_IN = '1d'; // accessToken 유효 기간 (2분)
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // refreshToken 유효 기간 (7일)

exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: '두 비밀번호가 일치하지 않습니다.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: '이메일 형식이 올바르지 않습니다.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: '이미 사용 중인 이메일입니다.',
        isExistingUser: true,
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          '비밀번호는 8자 이상으로 영문 대소문자, 숫자를 조합하여 입력하세요.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: '회원가입 성공', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: '서버 에러 발생', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: '존재하지 않는 이메일입니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    res.status(200).json({
      message: '로그인 성공',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 에러 발생', error });
  }
};

exports.logout = (req, res) => {
  try {
    res.status(200).json({
      message: '로그아웃 성공. 클라이언트에서 refreshToken을 삭제하세요.',
    });
  } catch (error) {
    res.status(500).json({ message: '서버 에러 발생', error });
  }
};

exports.refreshAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: 'refreshToken이 필요합니다.' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: '유효하지 않거나 만료된 refreshToken입니다.' });
      }

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        },
      );

      res.status(200).json({
        message: 'accessToken 갱신 성공',
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ message: '서버 에러 발생', error });
  }
};
