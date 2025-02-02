const nodemailer = require('nodemailer');
const config = require('../config');
require('dotenv').config();

const sendRecoveryCode = async (toEmail, recoveryCode) => {
  console.log(toEmail, recoveryCode);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.GMAIL_USER, // 발신자 이메일
      pass: config.GMAIL_APP_KEY, // 발신자 비밀번호
    },
  });

  const mailOptions = {
    from: `"TOAST IT" <${config.GMAIL_USER}>`,
    to: toEmail,
    subject: '[TOAST IT] 인증번호를 입력해주세요.',
    text: `${recoveryCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

module.exports = { sendRecoveryCode };
