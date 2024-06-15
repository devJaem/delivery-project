import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  ACCESS_KEY: process.env.ACCESS_SECRET_KEY,
  REFRESH_KEY: process.env.REFRESH_SECRET_KEY,
  PORT: process.env.PORT,
  EMAIL_SERVICE: process.env.USER_EMAIL,
  USER_EMAIL: process.env.USER_EMAIL,
  USER_PASSWORD: process.env.USER_PASSWORD,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};
