import { MESSAGES } from '../constants/message.constant.js';
import { NotFoundError, ConflictError } from '../errors/http.error.js';

class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // 리뷰 목록 조회
    getAllReview = async (sort) => {
        sort = sort?.toLowerCase();
        if (sort !== 'desc' && sort !== 'asc') {
            sort = 'desc';
        }
        const reviews = await this.reviewRepository.getAllReview(sort);
        return reviews.map((review) => {
            return {
                reviewId: review.reviewId,
                customerId: review.customerId,
                restaurantId: review.restaurantId,
                comment: review.comment,
                rating: review.rating,
                reviewPicture: review.reviewPicture,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            }
        });

    }
    // 리뷰 상세 조회
    getReviewById = async (reviewId) => {
        //해당 리뷰가 없을 시에
        const review = await this.reviewRepository.getReviewById(reviewId);
        if (!review) throw new NotFoundError(MESSAGES.REVIEW.GET_MORE.NOT_FOUND);
        return {
            reviewId: review.reviewId,
            customerId: review.customerId,
            restaurantId: review.restaurantId,
            comment: review.comment,
            rating: review.rating,
            reviewPicture: review.reviewPicture,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }
    }
    // 리뷰 생성
    createReview = async (user, createreview) => {
        //사용자가 리뷰 2개이상 사용할시
        const existedReview = await this.reviewRepository.existedReview(user);
        if (existedReview >= 1) throw new ConflictError(MESSAGES.REVIEW.MADE.FAILED.DUPLICATE);
        const review = await this.reviewRepository.createReview(user, createreview);
        return {
            reviewId: review.reviewId,
            customerId: review.customerId,
            restaurantId: review.restaurantId,
            comment: review.comment,
            rating: review.rating,
            reviewPicture: review.reviewPicture,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }
    }
    // 리뷰 수정
    putReview = async (reviewId, user, changereview) => {
        //해당 리뷰가 없을 시에
        const reviewExisted = await this.reviewRepository.existedReview(user);
        if (!reviewExisted) throw new NotFoundError(MESSAGES.REVIEW.GET_MORE.NOT_FOUND);
        const review = await this.reviewRepository.putReview(reviewId, user, changereview);
        return {
            reviewId: review.reviewId,
            customerId: review.customerId,
            restaurantId: review.restaurantId,
            comment: review.comment,
            rating: review.rating,
            reviewPicture: review.reviewPicture,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }
    }
    // 리뷰 삭제
    deleteReview = async (reviewId, user) => {
        //해당 리뷰가 없을 시에
        const reviewExisted = await this.reviewRepository.existedReview(user);
        if (!reviewExisted) throw new NotFoundError(MESSAGES.REVIEW.GET_MORE.NOT_FOUND);
        const review = await this.reviewRepository.deleteReview(reviewId, user);
        return { review };
    }
}

export default ReviewService;