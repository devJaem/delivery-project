import express from 'express';
import { createMenuSchema } from '../middlewares/vaildators/create-menu.validation.middleware.js';
import { imageUploader } from '../middlewares/image-upload-middleware.js';
import MenuController from '../controllers/menu.controller.js';
import MenuService from '../services/menu.service.js';
import MenuRepository from '../repositories/menu.repository.js';
import UserRepository from '../repositories/user.repository.js';
import RestaurantRepository from '../repositories/restaurant.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { requireType } from '../middlewares/require-roles.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { USER_TYPE } from '../constants/user.constant.js';

const menuRouter = express.Router();
const userRepository = new UserRepository(prisma);
const restaurantRepository = new RestaurantRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const menuService = new MenuService(menuRepository, restaurantRepository);
const menuController = new MenuController(menuService);

// 메뉴 생성
menuRouter.post(
  '/:restaurantId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.OWNER]),
  imageUploader.single('menuImage'),
  createMenuSchema,
  menuController.createMenu,
);

//메뉴 전체조회
menuRouter.get(
  '/:restaurantId/menu',
  authMiddleware(userRepository),
  menuController.getAllMenu,
);

//메뉴 상세조회 >> 옵션도 없는데 필요할까?
menuRouter.get(
  '/menu/:menuId',
  authMiddleware(userRepository),
  menuController.getMenuById,
);

menuRouter.patch(
  '/menu/:menuId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.OWNER]),
  imageUploader.single('menuImage'),
  menuController.updateMenu,
);

menuRouter.delete(
  '/menu/:menuId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.OWNER]),
  menuController.deleteMenu,
);

export default menuRouter;
