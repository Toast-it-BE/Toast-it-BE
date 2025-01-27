const nodemailer = require('nodemailer');

function generateRandomCode(n) {
  let str = '';
  for (let i = 0; i < n; i++) {
      str += Math.floor(Math.random() * 10);
  }
  return str;
}

const sendRecoveryCode = async (toEmail, recoveryCode) => {
  code = generateRandomCode(6); // 6자리 랜덤 코드 생성
  //console.log(toEmail, code);

  let transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'ttoastiit@gmail.com', // 발신자 이메일
      pass: 'codeitboost', // 발신자 비밀번호
    },
  });
  
  let mailOptions = {
    from: `"TOAST IT" <ttoastiit@gmail.com>`,
    to: toEmail,
    subject: '[TOAST IT] 인증번호를 입력해주세요.',
    text: `${recoveryCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};

module.exports = { sendRecoveryCode };