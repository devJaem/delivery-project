import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
/** 음식점 수정 joi **/
export const updateRestaurantSchema = async (req, res, next) => {
    try {
        const restaurantSchema = Joi.object({
            name: Joi.string().max(20).empty('').messages({
                'string.empty': MESSAGES.RESTAURANT.COMMON.RESTAURANT_NAME.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.RESTAURANT_NAME.MAX,
            }),
            address: Joi.string().max(20).empty('').messages({
                'string.empty': MESSAGES.RESTAURANT.COMMON.ADDRESS.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.ADDRESS.MAX,
            }),
            category: Joi.string().empty('').max(10).messages({
                'string.empty': MESSAGES.RESTAURANT.COMMON.CATEGORY.REQUIRED,
                'string.max': MESSAGES.RESTAURANT.COMMON.CATEGORY.MAX,
            }),
            description: Joi.string().empty('').max(50).messages({
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
