import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 메뉴 수정 joi **/
export const updateOrderStatusSchema = async (req, res, next) => {
  try {
    const orderStatusSchema = Joi.object({
      orderStatus: Joi.string()
        .valid('PREPARING', 'DELIVERING', 'COMPLETED')
        .required()
        .empty('')
        .messages({
          'string.empty': MESSAGES.ORDER.UPDATE_ORDER_STATUS.STATUS.REQUIRED,
          'string.max': MESSAGES.ORDER.UPDATE_ORDER_STATUS.STATUS.REQUIRED,
          'any.only': MESSAGES.ORDER.UPDATE_ORDER_STATUS.STATUS.INVALID,
        }),
    });
    await orderStatusSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
