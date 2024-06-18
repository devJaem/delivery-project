import express from 'express';
import UserController from '../controllers/user.controller.js';
import UserService from '../services/user.service.js';
import UserRepository from '../repositories/user.repository.js';
import AuthRepository from '../repositories/auth.repository.js';
import { userUpdateSchema } from '../middlewares/vaildators/update.user.validation.middleware.js';
import { imageUploadMiddleware } from '../middlewares/image-upload-middleware.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { refreshMiddleware } from '../middlewares/require-refresh-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';

const userRouter = express.Router();
const userRepository = new UserRepository(prisma);
const authRepository = new AuthRepository(prisma);
const userService = new UserService(userRepository, authRepository);
const userController = new UserController(userService);

/* 내 정보 조회 API */
userRouter.get(
  '/me',
  authMiddleware(userRepository),
  userController.getMyProfile,
);

/* 사용자 정보 조회 API */
userRouter.get('/:userId', userController.getUserProfile);

/* RefreshToken 재발급 API */
userRouter.post(
  '/token',
  refreshMiddleware(userRepository, authRepository),
  userController.refreshToken,
);

/* 내 정보 수정 API */
userRouter.patch(
  '/me',
  authMiddleware(userRepository),
  imageUploadMiddleware('profilePicture', 'profile'),
  userUpdateSchema,

  userController.updateMyProfile,
);

/* 회원 탈퇴 API */
userRouter.delete(
  '/me',
  authMiddleware(userRepository),
  userController.deleteMyProfile,
);

export default userRouter;
