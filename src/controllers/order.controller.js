import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  //주문
  createOrder = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const order = await this.orderService.createOrder(userId);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDER.CREATE.SUCCESS,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };

  //주문내역 상세조회
  getOrderById = async (req, res, next) => {
    try {
      const { userId, userType } = req.user;
      const { orderId } = req.params;

      const order = await this.orderService.getOrderById(
        userId,
        userType,
        +orderId,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.ORDER.GET_ORDER.SUCCESS,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default OrderController;
