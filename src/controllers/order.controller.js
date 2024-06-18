import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  createOrder = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const order = await this.orderService.createOrder(userId);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: '성공',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
