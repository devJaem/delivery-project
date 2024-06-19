import nodemailer from 'nodemailer';
import { ENV } from '../constants/env.constant.js';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: ENV.EMAIL_SERVICE,
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  secure: false, // TLS 사용
  auth: {
    user: ENV.USER_EMAIL,
    pass: ENV.USER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (mailOptions) => {
  mailOptions.from = ENV.USER_EMAIL;
  return transporter.sendMail(mailOptions);
};

export const generateEmailVerificationToken = () => {
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 5); // 5분 후 만료

  return { token, expires };
};
