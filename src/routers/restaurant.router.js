import express from 'express';
import RestaurantController from '../controllers/restaurant.controller.js';
import RestaurantService from '../services/restaurant.service.js';

import RestaurantRepository from '../repositories/restaurant.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { prisma } from '../utils/prisma.util.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
const restaurantRouter = express.Router();
const userRepository = new UserRepository(prisma);
const restaurantRepository = new RestaurantRepository(prisma);
const restaurantService = new RestaurantService(restaurantRepository);
const restaurantController = new RestaurantController(restaurantService);
// 음식점 목록 조회
restaurantRouter.get(
    '/restaurants',
    restaurantController.getAllRestaurant
)
// 음식점 상세 조회
restaurantRouter.get(
    '/restaurants/:id',
    restaurantController.getRestaurantById
)
// 음식점 생성
restaurantRouter.post(
    '/restaurants',
    authMiddleware(userRepository),
    restaurantController.createRestaurant
)
// 음식점 수정
restaurantRouter.put(
    '/restaurants/:id',
    authMiddleware(userRepository),
    restaurantController.putRestaurant
)
// 음식점 삭제
restaurantRouter.delete(
    '/restaurants/:id',
    authMiddleware(userRepository),
    restaurantController.deleteRestaurant
)
export default restaurantRouter;