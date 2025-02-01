const AuthService = require('../services/AuthService');
const UserSignupDTO = require('../dto/UserSignupDto');
const UserLoginDTO = require('../dto/UserLoginDto');

exports.signup = async (req, res) => {
  try {
    const user = await AuthService.signup(new UserSignupDTO(req.body));
    return res
      .status(201)
      .json({ message: '회원가입이 완료되었습니다.', user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await AuthService.login(new UserLoginDTO(req.body));
    return res.status(200).json({ message: '로그인되었습니다.', ...result });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.kakaoSignup = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const result = await AuthService.kakaoSignup(accessToken);
    return res.status(201).json({ message: '회원가입 성공', ...result });
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

exports.kakaoLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const result = await AuthService.kakaoLogin(accessToken);
    return res.status(200).json({ message: '로그인되었습니다.', ...result });
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await AuthService.deleteUser(req.user.id);
    return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getKakaoAccessToken = async (req, res) => {
  try {
    const { code } = req.query;
    const result = await AuthService.getKakaoAccessToken(code);
    return res
      .status(200)
      .json({ message: '카카오 액세스 토큰 발급 완료', accessToken: result });
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const result = await AuthService.logout();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.kakaoLogout = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const result = await AuthService.kakaoLogout(accessToken);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({ message: error.message });
  }
};
