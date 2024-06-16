import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 메뉴 생성 joi **/
export const createOptionSchema = async (req, res, next) => {
  try {
    const optionSchema = Joi.object({
      optionName: Joi.string().required().max(20).empty('').messages({
        'any.required': MESSAGES.OPTION.COMMON.OPTION_NAME.REQUIRED,
        'string.empty': MESSAGES.OPTION.COMMON.OPTION_NAME.REQUIRED,
        'string.max': MESSAGES.OPTION.COMMON.OPTION_NAME.MAX,
      }),
      description: Joi.string().required().empty('').max(50).messages({
        'any.required': MESSAGES.OPTION.COMMON.DESCRIPTION.REQUIRED,
        'string.empty': MESSAGES.OPTION.COMMON.DESCRIPTION.REQUIRED,
        'string.max': MESSAGES.OPTION.COMMON.DESCRIPTION.MAX,
      }),
      select: Joi.array().required().empty([]).min(2).max(10).messages({
        'any.required': MESSAGES.OPTION.COMMON.SELECT.REQUIRED,
        'array.max': MESSAGES.OPTION.COMMON.SELECT.MAX,
        'array.min': MESSAGES.OPTION.COMMON.SELECT.MIN,
      }),
    });
    await optionSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
