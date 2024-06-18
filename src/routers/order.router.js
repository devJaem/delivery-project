import express from 'express';
import OrderController from '../controllers/order.controller.js';
import OrderService from '../services/order.service.js';
import OrderRepository from '../repositories/order.repository.js';
import MenuRepository from '../repositories/menu.repository.js';
import RestaurantRepository from '../repositories/restaurant.repository.js'
import CartRepository from '../repositories/cart.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { requireType } from '../middlewares/require-user-type.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import { USER_TYPE } from '../constants/user.constant.js';

const orderRouter = express.Router();
const userRepository = new UserRepository(prisma);
const cartRepository = new CartRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const menuRepository = new MenuRepository(prisma);
const restaurantRepository = new RestaurantRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository, restaurantRepository, menuRepository);
const orderController = new OrderController(orderService);

// 주문
orderRouter.post(
  '/',
  authMiddleware(userRepository),
  requireType([USER_TYPE.CUSTOMER]),
  orderController.createOrder,
);


export default orderRouter;
