const nodemailer = require('nodemailer');

module.exports = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      port: 465,
      host: process.env.EMAIL_HOST,
    });
    await transporter.sendMail({
      from: `"Verify your email" <${process.env.EMAIL_USER}>`,
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
