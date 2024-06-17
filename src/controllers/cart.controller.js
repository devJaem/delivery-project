import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  createCartItem = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { menuId } = req.params;

      const cartItem = await this.cartService.createCartItem(userId, +menuId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: '카트담기성공',
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllCartItemById = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const cartItem = await this.cartService.getAllCartItemById(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: '카트조회완료',
        data: cartItem,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default CartController;
