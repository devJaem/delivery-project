import nodemailer from 'nodemailer';
import { ENV } from '../constants/env.constant';

const transporter = nodemailer.createTransport({
  service: ENV.EMAIL_SERVICE,
  auth: {
    user: ENV.USER_EMAIL,
    pass: ENV.USER_PASSWORD,
  },
});
