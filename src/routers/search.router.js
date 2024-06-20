import express from 'express';
import SearchController from '../controllers/search.controller.js';
import SearchService from '../services/search.service.js';
import SearchRepository from '../repositories/search.repository.js';
import { prisma } from '../utils/prisma.util.js';
import { SearchTypeMiddleware } from '../middlewares/search-Type.middleware.js';
const searchRouter = express.Router();
const searchReposiotry = new SearchRepository(prisma);
const searchService = new SearchService(searchReposiotry);
const searchController = new SearchController(searchService);

// 음식점 검색
searchRouter.get('/', SearchTypeMiddleware, searchController.getSearch);

export default searchRouter;
