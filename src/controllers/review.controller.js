import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';


class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }

    // 리뷰 목록 조회
    getAllReview = async (req, res, next) => {
        try {
            let { sort } = req.query;
            const { restaurantId } = req.params;
            const review = await this.reviewService.getAllReview(restaurantId, sort);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.REVIEW.GET_ALL.SUCCEED,
                data: review,
            });
        } catch (err) {
            next(err);
        }
    };
    // 리뷰 상세 조회
    getReviewById = async (req, res, next) => {
        try {
            const { restaurantId, reviewId } = req.params;
            const review = await this.reviewService.getReviewById(
                restaurantId,
                reviewId,
            );
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.REVIEW.GET_ALL.SUCCEED,
                data: review,
            });
        } catch (err) {
            next(err);
        }
    };
    // 리뷰 생성
    createReview = async (req, res, next) => {
        try {
            const user = req.user;
            const { restaurantId } = req.params;
            console.log(req.body);
            const reviewPictureUrl = req.body.reviewPicture;
            const createreview = { ...req.body, reviewPicture: reviewPictureUrl };
            const review = await this.reviewService.createReview(
                restaurantId,
                user,
                createreview,
            );
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.REVIEW.CREATE.SUCCEED,
                data: review,
            });
        } catch (err) {
            next(err);
        }
    };
    // 리뷰 수정
    putReview = async (req, res, next) => {
        try {
            const { reviewId, restaurantId } = req.params;
            const user = req.user;
            const reviewPictureUrl = req.body.reviewPicture;
            const changereview = { ...req.body, reviewPicture: reviewPictureUrl };
            const review = await this.reviewService.putReview(
                restaurantId,
                reviewId,
                user,
                changereview,
            );
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.REVIEW.UPDATE.SUCCEED,
                data: review,
            });
        } catch (err) {
            next(err);
        }
    };
    // 리뷰 삭제
    deleteReview = async (req, res, next) => {
        try {
            const { reviewId, restaurantId } = req.params;
            const user = req.user;
            const review = await this.reviewService.deleteReview(
                restaurantId,
                reviewId,
                user,
            );
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: MESSAGES.REVIEW.DELETE.SUCCEED,
                data: review,
            });
        } catch (err) {
            next(err);
        }
    };
}

export default ReviewController;
