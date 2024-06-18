import express from 'express';
import CartController from '../controllers/cart.controller.js';
import CartService from '../services/cart.service.js';
import CartRepository from '../repositories/cart.repository.js';
import MenuRepository from '../repositories/menu.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { requireType } from '../middlewares/require-user-type.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { USER_TYPE } from '../constants/user.constant.js';

const cartRouter = express.Router();
const userRepository = new UserRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository, menuRepository);
const cartController = new CartController(cartService);

// 메뉴 생성
cartRouter.post(
  '/item/:menuId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.createCartItem,
);

// 장바구니 조회
cartRouter.get(
  '/',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.getAllCartItem,
);

// 장바구니 메뉴 수량 수정
cartRouter.patch(
  '/item/:cartItemId/:quantity',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.updateQuantity,
);

//장바구니 메뉴 삭제
cartRouter.delete(
  '/item/:cartItemId',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.deleteCartItem,
);

// 장바구니 메뉴 모두 삭제
cartRouter.delete(
  '/item',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  cartController.deleteAllItems,
);

export default cartRouter;
