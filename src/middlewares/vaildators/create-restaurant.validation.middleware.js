import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 음식점 생성 joi **/
export const createRestaurantSchema = async (req, res, next) => {
    try {
        const restaurantSchema = Joi.object({
            name: Joi.string().required().max(20).empty('').messages({
                'any.required': MESSAGES.RESTAURANT.COMMON.RESTAURANT_NAME.REQUIRED,
                'string.empty': MESSAGES.RESTAURANT.COMMON.RESTAURANT_NAME.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.RESTAURANT_NAME.MAX,
            }),
            address: Joi.string().required().max(20).empty('').messages({
                'any.required': MESSAGES.RESTAURANT.COMMON.ADDRESS.REQUIRED,
                'string.empty': MESSAGES.RESTAURANT.COMMON.ADDRESS.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.ADDRESS.MAX,
            }),
            category: Joi.string().required().empty('').max(10).messages({
                'any.required': MESSAGES.RESTAURANT.COMMON.CATEGORY.REQUIRED,
                'string.empty': MESSAGES.RESTAURANT.COMMON.CATEGORY.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.CATEGORY.MAX,
            }),
            description: Joi.string().required().empty('').max(50).messages({
                'any.required': MESSAGES.RESTAURANT.COMMON.DESCRIPTION.REQUIRED,
                'string.empty': MESSAGES.RESTAURANT.COMMON.DESCRIPTION.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.DESCRIPTION.MAX,
            }),
            restaurantPicture: Joi.string().uri().optional(),
        })

        await restaurantSchema.validateAsync(req.body);
        next();
    } catch (error) {
        next(error);
    }
};
