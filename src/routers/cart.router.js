import express from 'express';
import CartController from '../controllers/cart.controller.js';
import CartService from '../services/cart.service.js';
import CartRepository from '../repositories/cart.repository.js';
import MenuRepository from '../repositories/menu.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { requireType } from '../middlewares/require-user-type.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import { USER_TYPE } from '../constants/user.constant.js';

const cartRouter = express.Router();
const userRepository = new UserRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const cartRepository = new CartRepository(prisma, Prisma);
const cartService = new CartService(cartRepository, menuRepository);
const cartController = new CartController(cartService);

// 메뉴 생성
cartRouter.post(
  '/item/:menuId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.createCartItem,
);

export default cartRouter;
