import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 리뷰 생성 joi **/
export const createReviewSchema = async (req, res, next) => {
  try {
    const reviewtSchema = Joi.object({
      comment: Joi.string().required().max(50).empty('').messages({
        'any.required': MESSAGES.REVIEW.COMMON.COMMENT_NAME.REQUIRED,
        'string.empty': MESSAGES.REVIEW.COMMON.COMMENT_NAME.REQUIRED,
        'string.max': MESSAGES.REVIEW.COMMON.COMMENT_NAME.MAX,
      }),
      rating: Joi.string().regex(/^\d+$/).required().messages({
        'any.required': MESSAGES.REVIEW.COMMON.RATING.REQUIRED,
        'string.empty': MESSAGES.REVIEW.COMMON.RATING.REQUIRED,
        'string.pattern.base': MESSAGES.REVIEW.COMMON.RATING.IS_NOT_NUM,
      }),
      reviewPicture: Joi.string().uri().optional(),
    });

    await reviewtSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
