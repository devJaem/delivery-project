import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 검색  joi **/
export const SearchSchema = async (req, res, next) => {
  try {
    const searchSchmea = Joi.object({
      searchType: Joi.string().required().max(20).empty('').messages({
        'any.required': MESSAGES.SEARCH.COMMON.REQUIRED,
        'string.empty': MESSAGES.SEARCH.COMMON.REQUIRED,
        'string.max': MESSAGES.SEARCH.COMMON.MAX,
      }),
      searchWord: Joi.string().required().max(20).empty('').messages({
        'any.required': MESSAGES.SEARCH.COMMON.REQUIRED,
        'string.empty': MESSAGES.SEARCH.COMMON.REQUIRED,
        'string.max': MESSAGES.SEARCH.COMMON.MAX,
      }),
    });
    await searchSchmea.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
