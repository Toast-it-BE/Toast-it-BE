const AuthService = require('../services/AuthService');
const UserSignupDTO = require('../dto/UserSignupDto');
const UserLoginDTO = require('../dto/UserLoginDto');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');

exports.checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new ValidationError('이메일을 입력해주세요.', 400);

    const exists = await AuthService.checkEmailExists(email);

    return res.status(200).json({ exists });
  } catch (error) {
    return next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const user = await AuthService.signup(new UserSignupDTO(req.body));
    return res
      .status(201)
      .json({ message: '회원가입이 완료되었습니다.', user });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { token, ...result } = await AuthService.login(
      new UserLoginDTO(req.body),
    );

    return res
      .status(200)
      .json({ message: '로그인되었습니다.', ...result, token });
  } catch (error) {
    return next(error);
  }
};

exports.restore = async (req, res, next) => {
  try {
    const authData = await AuthService.restoreAuth(req);
    if (!authData) throw new AuthError('로그인이 필요합니다.');

    return res
      .status(200)
      .json({ message: '토큰이 유효합니다.', user: authData.user });
  } catch (error) {
    return next(error);
  }
};

exports.kakaoSignup = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    const result = await AuthService.kakaoSignup(accessToken);

    return res.status(201).json({ message: '회원가입 성공', ...result });
  } catch (error) {
    return next(error);
  }
};

exports.kakaoLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const result = await AuthService.kakaoLogin(accessToken);
    return res.status(200).json({ message: '로그인되었습니다.', ...result });
  } catch (error) {
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await AuthService.deleteUser(req.user.id);
    return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    return next(error);
  }
};

exports.getKakaoAccessToken = async (req, res, next) => {
  try {
    const { code } = req.query;
    const result = await AuthService.getKakaoAccessToken(code);
    return res
      .status(200)
      .json({ message: '카카오 액세스 토큰 발급 완료', accessToken: result });
  } catch (error) {
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const result = await AuthService.logout();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

exports.kakaoLogout = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const result = await AuthService.kakaoLogout(accessToken);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
