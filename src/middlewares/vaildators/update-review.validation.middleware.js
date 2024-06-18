import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 리뷰 수정 joi **/
export const updateReviewSchema = async (req, res, next) => {
  try {
    const reviewtSchema = Joi.object({
      comment: Joi.string().max(50).empty('').messages({
        'string.empty': MESSAGES.REVIEW.COMMON.COMMENT_NAME.REQUIRED,
        'string.max': MESSAGES.REVIEW.COMMON.COMMENT_NAME.MAX,
      }),
      rating: Joi.string().regex(/^\d+$/).messages({
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
