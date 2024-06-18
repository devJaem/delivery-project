import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 메뉴 수정 joi **/
export const createMenuSchema = async (req, res, next) => {
  try {
    const menuSchema = Joi.object({
      menuName: Joi.string().max(20).empty('').messages({
        'string.empty': MESSAGES.MENU.COMMON.MENU_NAME.REQUIRED,
        'string.max': MESSAGES.MENU.COMMON.MENU_NAME.MAX,
      }),
      price: Joi.string().regex(/^\d+$/).messages({
        'string.pattern.base': MESSAGES.MENU.COMMON.PRICE.IS_NOT_NUM,
      }),
      description: Joi.string().empty('').max(50).messages({
        'string.empty': MESSAGES.MENU.COMMON.DESCRIPTION.REQUIRED,
        'string.max': MESSAGES.MENU.COMMON.DESCRIPTION.MAX,
      }),
      menuImage: Joi.string().uri().optional(),
    });
    await menuSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
