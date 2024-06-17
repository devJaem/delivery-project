import express from 'express';
import { createMenuSchema } from '../middlewares/vaildators/menu.validation.middleware.js';
import { createOptionSchema } from '../middlewares/vaildators/option.validation.middleware.js';
import { imageUploader } from '../middlewares/image-upload-middleware.js';
import MenuController from '../controllers/menu.controller.js';
import MenuService from '../services/menu.service.js';
import MenuRepository from '../repositories/menu.repository.js';
import UserRepository from '../repositories/user.repository.js';
//import RestaurantRepository from '../repositories/restaurant.repository.js'; // 생성 전
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { USER_TYPE } from '../constants/user.constant.js';

const menuRouter = express.Router();
const userRepository = new UserRepository(prisma);
//const restaurantRepository = new RestaurantRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const menuService = new MenuService(menuRepository /*, restaurantRepository*/);
const menuController = new MenuController(menuService);

// 메뉴 생성
menuRouter.post(
  '/:restaurantId',
  authMiddleware(userRepository),
  requireRoles([USER_TYPE.OWNER]),
  createMenuSchema,
  imageUploader.single('menuImage'),
  menuController.createMenu,
);

// 옵션 생성
menuRouter.post(
  '/option/:menuId',
  authMiddleware(userRepository),
  requireRoles([USER_TYPE.OWNER]),
  createOptionSchema,
  menuController.createOption,
);

export default menuRouter;
