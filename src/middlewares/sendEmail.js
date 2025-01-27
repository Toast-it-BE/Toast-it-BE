const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'ttoastiit@gmail.com', // 발신자 이메일
    pass: 'codeitboost', // 발신자 비밀번호
  },
});


const sendRecoveryCode = async (toEmail, recoveryCode) => {
  const mailOptions = {
    from: 'ttoastiit@gmail.com',
    to: toEmail,
    subject: '복구 코드입니다',
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