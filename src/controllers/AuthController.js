const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Memo = require('../models/Memo');
const config = require('../config');
const UserSignupDTO = require('../dto/UserSignupDto');
const UserLoginDTO = require('../dto/UserLoginDto');

// 회원가입
exports.signup = async (req, res) => {
  try {
    const userSignupDTO = new UserSignupDTO(req.body);
    userSignupDTO.validate();

    const { email, password } = userSignupDTO;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      categories: [],
    });
    await newUser.save();

    const categoryNames = [
      '카테고리1',
      '카테고리2',
      '카테고리3',
      '카테고리4',
      '카테고리5',
    ];

    const categories = await Category.insertMany(
      categoryNames.map(name => ({ userId: newUser.id, name })),
    );

    newUser.categories = categories.map(category => category.id);
    await newUser.save();

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        email: newUser.email,
        categories: newUser.categories,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const userLoginDTO = new UserLoginDTO(req.body);
    userLoginDTO.validate();

    const { email, password } = userLoginDTO;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: '1h',
      },
    );

    return res.status(200).json({
      message: '로그인되었습니다.',
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 카카오 회원가입
exports.kakaoSignup = async (req, res) => {
  const { accessToken } = req.body;

  try {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = kakaoResponse.data;

    const kakaoAccount = kakaoUser.kakao_account || {};
    const email = kakaoAccount.email || null;

    if (!email) {
      return res
        .status(401)
        .json({ message: '카카오에서 이메일 정보를 제공하지 않습니다.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: '이미 가입되어있는 이메일입니다.' });
    }

    user = new User({ email, isOAuthUser: true });
    await user.save();

    const categoryNames = [
      '카테고리1',
      '카테고리2',
      '카테고리3',
      '카테고리4',
      '카테고리5',
    ];
    const categoryDocs = categoryNames.map(name => ({
      userId: user.id,
      name,
    }));
    const categories = await Category.insertMany(categoryDocs);

    const categoryResponse = categories.map(({ _id, name }) => ({
      id: _id,
      name,
    }));

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: '1h',
      },
    );

    return res.status(201).json({
      message: '회원가입 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        categories: categoryResponse,
      },
    });
  } catch (error) {
    console.error(
      '카카오 회원가입 오류:',
      error.response ? error.response.data : error,
    );
    return res
      .status(502)
      .json({ message: '카카오 서버와 통신이 원할하지 않습니다.' });
  }
};

// 카카오 액세스 토큰 요청
exports.getKakaoAccessToken = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: config.KAKAO_CLIENT_ID,
          redirect_uri: config.KAKAO_REDIRECT_URI,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    return res.json({ accessToken });
  } catch (error) {
    console.error(
      '카카오 액세스 토큰 요청 오류:',
      error.response ? error.response.data : error,
    );
    return res.status(502).json({ message: '카카오 액세스 토큰 요청 실패' });
  }
};

// 카카오 로그인
exports.kakaoLogin = async (req, res) => {
  const { accessToken } = req.body;
  try {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = kakaoResponse.data;

    const kakaoAccount = kakaoUser.kakao_account || {};
    const email = kakaoAccount.email || null;

    if (!email) {
      return res
        .status(401)
        .json({ message: '유효하지 않은 카카오 액세스 토큰입니다.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: '해당 카카오 계정으로 가입된 사용자가 없습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: '7d',
      },
    );

    return res.status(200).json({
      message: '로그인되었습니다.',
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(
      '카카오 로그인 오류:',
      error.response ? error.response.data : error,
    );
    return res
      .status(502)
      .json({ message: '카카오 서버와 통신이 원할하지 않습니다.' });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 카카오 로그아웃
exports.kakaoLogout = async (req, res) => {
  const { accessToken } = req.body;

  try {
    await axios.post(
      'https://kapi.kakao.com/v1/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res
      .status(200)
      .json({ message: '카카오 로그아웃이 완료되었습니다.' });
  } catch (error) {
    console.error(
      '카카오 로그아웃 오류:',
      error.response ? error.response.data : error,
    );
    return res
      .status(502)
      .json({ message: '카카오 로그아웃 요청이 실패했습니다.' });
  }
};

// 회원 탈퇴
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: '탈퇴된 사용자이거나 존재하지 않는 사용자입니다.' });
    }

    await Memo.deleteMany({ userId });
    await Category.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.error('회원 탈퇴 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
