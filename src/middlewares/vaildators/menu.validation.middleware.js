import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 메뉴 생성 joi **/
export const createMenuSchema = async (req, res, next) => {
  try {
    const menuSchema = Joi.object({
      menuName: Joi.string().required().max(20).empty('').messages({
        'any.required': MESSAGES.MENU.COMMON.MENU_NAME.REQUIRED,
        'string.empty': MESSAGES.MENU.COMMON.MENU_NAME.REQUIRED,
        'string.max': MESSAGES.MENU.COMMON.MENU_NAME.MAX,
      }),
      price: Joi.number()
        .integer()
        .min(100)
        .max(100000)
        .required()
        .messages({
          'any.required': MESSAGES.MENU.COMMON.PRICE.REQUIRED,
          'number.integer': MESSAGES.MENU.COMMON.PRICE.IS_NOT_NUM,
          'number.max': MESSAGES.MENU.COMMON.PRICE.MAX,
          'number.min': MESSAGES.MENU.COMMON.PRICE.MIN,
        }),
      description: Joi.string().required().empty('').max(50).messages({
        'any.required': MESSAGES.MENU.COMMON.DESCRIPTION.REQUIRED,
        'string.empty': MESSAGES.MENU.COMMON.DESCRIPTION.REQUIRED,
        'string.max': MESSAGES.MENU.COMMON.DESCRIPTION.MAX,
      }),
    });
    await menuSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
