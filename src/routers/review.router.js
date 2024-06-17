import express from 'express';
import ReviewController from '../controllers/review.controller.js';
import ReviewService from '../services/review.service.js';
import ReviewRepository from '../repositories/review.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { requireType } from '../middlewares/require-user-type.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { authMiddleware } from '../middlewares/require-access-token.middleware.js';
import { USER_TYPE } from '../constants/user.constant.js';
import { imageUploader } from '../middlewares/image-upload-middleware.js';
const reviewRouter = express.Router();
const userRepository = new UserRepository(prisma);
const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

// 리뷰 목록 조회
reviewRouter.get(
    '/',
    reviewController.getAllReview
)
// 리뷰 상세 조회
reviewRouter.get(
    '/:reviewId',
    reviewController.getReviewById
)
// 리뷰 생성
reviewRouter.post(
    '/',
    imageUploader.single('reviewPicture'),
    authMiddleware(userRepository),
    requireType([USER_TYPE.CUSTOMER]),
    reviewController.createReview
)
// 리뷰 수정
reviewRouter.put(
    '/:reviewId',
    imageUploader.single('reviewPicture'),
    authMiddleware(userRepository),
    requireType([USER_TYPE.CUSTOMER]),
    reviewController.putReview
)
// 리뷰 삭제
reviewRouter.delete(
    '/:reviewId',
    imageUploader.single('reviewPicture'),
    authMiddleware(userRepository),
    requireType([USER_TYPE.CUSTOMER]),
    reviewController.deleteReview
)
export default reviewRouter;