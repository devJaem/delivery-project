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
      price: Joi.string().regex(/^\d+$/)
        .required()
        .messages({
          'any.required': MESSAGES.MENU.COMMON.PRICE.REQUIRED,
          'string.pattern.base': MESSAGES.MENU.COMMON.PRICE.IS_NOT_NUM,
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
