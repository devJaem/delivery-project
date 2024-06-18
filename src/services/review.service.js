import { MESSAGES } from '../constants/message.constant.js';
import { NotFoundError, ConflictError } from '../errors/http.error.js';

class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    // 리뷰 목록 조회
    getAllReview = async (restaurantId, sort) => {
        sort = sort?.toLowerCase();
        if (sort !== 'desc' && sort !== 'asc') {
            sort = 'desc';
        }
        //해당 음식점이 없을 경우
        const existedrestaurant = await this.reviewRepository.existedRestaurant(restaurantId);
        if (!existedrestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);   //에러 고치기
        const reviews = await this.reviewRepository.getAllReview(restaurantId, sort);
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
    getReviewById = async (restaurantId, reviewId) => {
        //해당 음식점이 없을 경우
        const existedrestaurant = await this.reviewRepository.existedRestaurant(restaurantId);
        if (!existedrestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        //해당 리뷰가 없을 시에
        const review = await this.reviewRepository.getReviewById(restaurantId, reviewId);
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
    createReview = async (restaurantId, user, createreview) => {
        //해당 음식점이 없을 경우
        const existedrestaurant = await this.reviewRepository.existedRestaurant(restaurantId);
        if (!existedrestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        const review = await this.reviewRepository.createReview(restaurantId, user, createreview);
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
    putReview = async (restaurantId, reviewId, user, changereview) => {
        //해당 음식점이 없을 경우
        const existedrestaurant = await this.reviewRepository.existedRestaurant(restaurantId);
        if (!existedrestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        //해당 리뷰가 없을 시에
        const reviewExisted = await this.reviewRepository.getReviewById(restaurantId, reviewId);
        if (!reviewExisted) throw new NotFoundError(MESSAGES.REVIEW.GET_MORE.NOT_FOUND);
        const review = await this.reviewRepository.putReview(restaurantId, reviewId, user, changereview);
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
    deleteReview = async (restaurantId, reviewId, user) => {
        //해당 음식점이 없을 경우
        const existedrestaurant = await this.reviewRepository.existedRestaurant(restaurantId);
        if (!existedrestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        //해당 리뷰가 없을 시에
        const reviewExisted = await this.reviewRepository.getReviewById(restaurantId, reviewId);
        if (!reviewExisted) throw new NotFoundError(MESSAGES.REVIEW.GET_MORE.NOT_FOUND);
        const review = await this.reviewRepository.deleteReview(restaurantId, reviewId, user);
        return { review };
    }
}

export default ReviewService;