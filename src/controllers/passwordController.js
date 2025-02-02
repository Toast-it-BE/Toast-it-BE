const PasswordService = require('../services/PasswordService');

exports.sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await PasswordService.sendRecoveryCode(email);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const response = await PasswordService.verifyRecoveryCode(email, code);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const response = await PasswordService.resetPassword(
      req.user,
      newPassword,
      confirmPassword,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const response = await PasswordService.changePassword(
      token,
      currentPassword,
      newPassword,
      confirmPassword,
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
