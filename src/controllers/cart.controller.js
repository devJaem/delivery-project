import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  // 카트 아이템 생성
  createCartItem = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { menuId } = req.params;

      const cartItem = await this.cartService.createCartItem(userId, +menuId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CART.CREATE.SUCCEED,
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  // 카트 모든 아이템 조회
  getAllCartItem = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const cartItem = await this.cartService.getAllCartItem(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CART.READ.SUCCEED,
        data: cartItem,
      });
    } catch (err) {
      next(err);
    }
  };

  // 카트 아이템 수량 수정
  updateQuantity = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { cartItemId, quantity } = req.params;
      const cartItem = await this.cartService.updateQuantity(
        +cartItemId,
        +quantity,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CART.UPDATE.SUCCEED,
        data: cartItem,
      });
    } catch (err) {
      next(err);
    }
  };

  // 카트 아이템 삭제
  deleteCartItem = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { cartItemId } = req.params;

      const cartItem = await this.cartService.deleteCartItem(+cartItemId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CART.DELETE.SUCCEED,
        data: cartItem,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteAllItems = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const cartItem = await this.cartService.deleteAllItems(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CART.DELETE_ALL.SUCCEED,
        data: cartItem,
      });
    } catch (err) {
      next(err);
    }
  };
}
export default CartController;
