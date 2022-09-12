const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const sendMail = require('../utils/sendEmail');

exports.sendForgetPasswordVerificationLink = async (req, res, next) => {
  try {
    const email = req.body.email;
    // 1. find user this email
    const user = await User.findOne({ email });

    // 2. email doesn't exist
    if (!user)
      return res.status(404).json({
        message: 'User not found  this email',
      });

    // 3. send forget password verification link
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const to = user.email;
    const subject = 'Reset Password Verification Link';
    const html = `<h2>Hi ${user?.name}</h2><h2> Please click on given link to reset your password</h2>
      <p><a href="http://${req.headers.host}/reset-password?token=${token}">change password</a></p>
      or copy this link  "http://${req.headers.host}/reset-password?token=${token}"`;

    const sent = await sendMail(to, subject, html);
    console.log(sent);

    if (sent == true) {
      res.status(200).json({
        status: 'success',
        message: 'Please check your email and reset your password',
      });
    } else {
      res.status(sent.statusCode).json({
        sent,
      });
    }
  } catch (error) {
    console.log('email', error);
    next(error);
  }
};

// reset password
exports.resatPassword = async (req, res, next) => {
  try {
    const token = req.body.token || '';
    const newPassword = req.body.newPassword.trim();
    if (!token || !newPassword) {
      return res.status(402).json({
        error: {
          message: 'Please provide your new password',
        },
      });
    }
    if (token && newPassword) {
      const decodeData = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      if (!decodeData) {
        return res.status(401).json({
          error: {
            message: 'incorrect token or it is expired',
          },
        });
      }
      const user = await User.findById(decodeData.id);
      user.password = newPassword;
      await user.save();
      // send final res
      return res.status(200).json({
        message: 'password changed successfully',
      });
    } else {
      return res.status(401).json({ error: 'Authentication error!!' });
    }
  } catch (error) {
    next(error);
  }
};
