import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { MIN_PASSWORD_LENGTH } from '../../constants/auth.constant.js';
/** 유저 회원가입 joi **/
export const userCreateSchema = async (req, res, next) => {
  try {
    const userSchema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .empty('')
        .messages({
          'string.email': MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT,
          'any.required': MESSAGES.AUTH.COMMON.EMAIL.REQUIRED,
        }),

      password: Joi.string()
        .min(MIN_PASSWORD_LENGTH)
        .required()
        .empty('')
        .messages({
          'string.min': MESSAGES.AUTH.COMMON.PASSWORD.MIN_LENGTH,
          'any.required': MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED,
        }),

      checkPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .empty('')
        .messages({
          'any.only':
            MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
          'any.required': MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.REQUIRED,
        }),
      nickName: Joi.string().required().empty('').messages({
        'any.required': MESSAGES.AUTH.COMMON.NICKNAME.REQUIRED,
      }),

      userType: Joi.string()
        .valid('CUSTOMER', 'OWNER')
        .required()
        .empty('')
        .messages({
          'any.only': MESSAGES.AUTH.COMMON.USER_TYPE.INVALID,
          'any.required': MESSAGES.AUTH.COMMON.USER_TYPE.REQUIRED,
        }),

      profilePicture: Joi.string()
      .uri()
      .optional(),
    });

    await userSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
