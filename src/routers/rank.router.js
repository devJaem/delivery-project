import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import RankController from '../controllers/rank.controller.js';
import RankService from '../services/rank.service.js';
import RankRepository from '../repositories/rank.repository.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import UserRepository from '../repositories/user.repository.js';
const rankRouter = express.Router();
const userRepository = new UserRepository(prisma);
const rankRepository = new RankRepository(prisma);
const rankService = new RankService(rankRepository);
const rankController = new RankController(rankService);

// 랭킹 조회

rankRouter.get('/', authMiddleware(userRepository), rankController.getRank);

export default rankRouter;
