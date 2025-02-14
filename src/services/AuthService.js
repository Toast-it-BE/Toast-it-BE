const axios = require('axios');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const User = require('../models/User');
const Category = require('../models/Category');
const Memo = require('../models/Memo');
const config = require('../config');
const { generateCategory } = require('../utils/generateCategory');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

class AuthService {
  static async checkEmailExists(email) {
    try {
      const user = await User.findOne({ email });
      return !!user;
    } catch (error) {
      console.error('이메일 조회 오류:', error);
      throw error;
    }
  }

  // 일반 회원가입
  static async signup(userSignupDTO) {
    userSignupDTO.validate();
    const { email, password } = userSignupDTO;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AuthError('이미 사용 중인 이메일입니다.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const categoriesData = await generateCategory(newUser.id);

    const categories = await Category.insertMany(categoriesData);

    newUser.categories = categories.map(category => category.id);
    await newUser.save();

    return {
      id: newUser.id,
      email: newUser.email,
      categories: newUser.categories,
    };
  }

  // 일반 로그인
  static async login(userLoginDTO) {
    userLoginDTO.validate();
    const { email, password } = userLoginDTO;

    const user = await User.findOne({ email });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError('비밀번호가 일치하지 않습니다.', 401);

    const token = jwtUtils.generateAccessToken(user.id, user.email);

    return { user: { id: user.id, email: user.email }, token };
  }

  // 카카오 회원가입
  static async kakaoSignup(accessToken) {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = kakaoResponse.data.kakao_account?.email;
    if (!email)
      throw new ValidationError('카카오에서 이메일 정보를 제공하지 않습니다.');

    let user = await User.findOne({ email });
    if (user) throw new AuthError('이미 가입되어있는 이메일입니다.', 409);

    user = new User({ email, isOAuthUser: true });
    await user.save();

    const categoriesData = await generateCategory(user.id);
    const categories = await Category.insertMany(categoriesData);

    const token = jwtUtils.generateAccessToken(user.id, user.email);

    return { user: { id: user.id, email: user.email, categories }, token };
  }

  static async getKakaoAccessToken(code) {
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

      return tokenResponse.data.access_token;
    } catch (error) {
      console.error(
        '카카오 액세스 토큰 요청 오류:',
        error.response ? error.response.data : error,
      );
      throw new AuthError('카카오 액세스 토큰 요청 실패', 502);
    }
  }

  // 카카오 로그인
  static async kakaoLogin(accessToken) {
    const kakaoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = kakaoResponse.data.kakao_account?.email;
    if (!email)
      throw new AuthError('유효하지 않은 카카오 액세스 토큰입니다.', 401);

    const user = await User.findOne({ email });
    if (!user)
      throw new NotFoundError('해당 카카오 계정으로 가입된 사용자가 없습니다.');

    const token = jwtUtils.generateAccessToken(user.id, user.email);

    return { user: { id: user.id, email: user.email }, token };
  }

  // 로그인 복원
  static async restoreAuth(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const user = await jwtUtils.verifyAccessToken(token);

    if (!user) return null;

    return { accessToken: token, user };
  }

  // 회원 탈퇴
  static async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user)
      throw new NotFoundError(
        '탈퇴된 사용자이거나 존재하지 않는 사용자입니다.',
      );

    await Memo.deleteMany({ userId });
    await Category.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
  }

  // 일반 로그아웃 (클라이언트가 토큰을 삭제하면 됨)
  static async logout() {
    return { message: '로그아웃되었습니다.' };
  }

  // 카카오 로그아웃 (카카오 API 호출)
  static async kakaoLogout(accessToken) {
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
      return { message: '카카오 로그아웃이 완료되었습니다.' };
    } catch (error) {
      throw new AuthError('카카오 로그아웃 요청 실패', 502);
    }
  }
}

module.exports = AuthService;
