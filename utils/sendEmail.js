const nodemailer = require('nodemailer');

module.exports = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hasankhan20182@gmail.com',
        pass: 'xgrjgpvkjgghakgb',
      },
      port: 465,
      host: 'smtp.gmail.com',
    });
    await transporter.sendMail({
      from: '"Verify your email" <support@trioaceinternational.com>',
      to: email,
      subject: subject,
      html: html,
    });
    console.log('Email sent Successfully');
    return true;
  } catch (err) {
    // console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return err;
  }
};
