import express from 'express';
import MenuController from '../controllers/user.controller.js';
import MenuService from '../services/user.service.js';
import MenuRepository from '../repositories/user.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { USER_TYPE } from '../constants/user.constant.js';

const menuRouter = express.Router();
const userRepository = new UserRepository(prisma);

const menuRepository = new MenuRepository(prisma);
const menuService = new MenuService(menuRepository);
const menuController = new MenuController(menuService);

menuRouter.post(
  '/:restaurantId',
  authMiddleware(userRepository),
  requireRoles([USER_TYPE.OWNER]),
  menuController.xreateMenu,
);

export default menuRouter;
