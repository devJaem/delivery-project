import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { ConflictError, HttpError } from '../../errors/http.error.js';
import { MIN_PASSWORD_LENGTH } from '../../constants/auth.constant.js';

/** 유저 정보 수정 joi **/
export const userUpdateSchema = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      password: Joi.string()
        .min(MIN_PASSWORD_LENGTH)
        .optional()
        .empty('')
        .messages({
          'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
          'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
        }),

      checkPassword: Joi.string()
        .valid(Joi.ref('password'))
        .optional()
        .empty('')
        .messages({
          'any.only':
            MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
          'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
        }),

      nickName: Joi.string().optional().empty('').messages({
        'any.required': MESSAGES.AUTH.COMMON.NICKNAME.REQUIRED,
      }),

      profilePicture: Joi.string().uri().optional(),
    }).with('password', 'checkPassword'); // password와 checkPassword가 함께 존재해야 함

    await userSchema.validateAsync(req.body);

    if (req.body.email || req.body.userType || req.body.createdAt) {
      throw new ConflictError(MESSAGES.USERS.UPDATE_ME.FAIL);
    }

    next();
  } catch (error) {
    next(error);
  }
};
