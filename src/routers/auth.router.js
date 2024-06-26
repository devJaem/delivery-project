import express from 'express';
import { userCreateSchema } from '../middlewares/vaildators/sign-up.validation.middleware.js';
import { userLoginSchema } from '../middlewares/vaildators/sign-in.validation.middleware.js';
import { imageUploadMiddleware } from '../middlewares/image-upload-middleware.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import AuthController from '../controllers/auth.controller.js';
import AuthService from '../services/auth.service.js';
import UserRepository from '../repositories/user.repository.js';
import AuthRepository from '../repositories/auth.repository.js';
import { prisma } from '../utils/prisma.util.js';

const authRouter = express.Router();
const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, userRepository);
const authController = new AuthController(authService);

/* 회원가입 API */
authRouter.post(
  '/sign-up',
  imageUploadMiddleware('profilePicture', 'profile'), // 프로필 이미지 업로드 미들웨어
  userCreateSchema,
  authController.signUp,
);
/* 로그인 API */
authRouter.post('/sign-in', userLoginSchema, authController.signIn);

/* 로그아웃 API */
authRouter.get(
  '/logout',
  authMiddleware(userRepository),
  authController.logout,
);

/* 이메일 발송 API */
authRouter.post('/email', authController.sendVerificationEmail);

/* 이메일 인증 API */
authRouter.post('/verify-email', authController.verifyEmail);

export default authRouter;
