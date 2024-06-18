import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../errors/http.error.js';

class OrderService {
  constructor(
    orderRepository,
    cartRepository,
    restaurantRepository,
    menuRepository,
    userRepository,
  ) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
    this.restaurantRepository = restaurantRepository;
    this.menuRepository = menuRepository;
    this.userRepository = userRepository;
  }

  createOrder = async (userId) => {
    // 0. 카트 내역 가져오기
    const cart = await this.cartRepository.getCartById(userId);
    if (!cart) {
      throw new BadRequestError('주문할게없음');
    }

    const cartItems = await this.cartRepository.getAllCartItem(cart.cartId);
    if (!cartItems) {
      throw new BadRequestError('주문할게없음');
    }

    // 1. 주문 제대로 됐는지 확인 - 만약 식당이 없으면 에러
    const restaurant = await this.restaurantRepository.getRestaurantById(
      cart.restaurantId,
    );
    if (!restaurant) {
      throw new BadRequestError('식당 사라짐');
    }

    // 2. 메뉴별 가격 더하기, 메뉴 없으면 에러
    let totalPrice = 0;
    cartItems.forEach(async (item) => {
      const menu = await this.menuRepository.getMenuById(item.menuId);
      totalPrice += item.quantity * menu.price;
      if (!menu) {
        throw new BadRequestError('메뉴 사라짐');
      }
    });

    // 3. 포인트 있는지 확인 - 모자라면 에러
    const user = await this.userRepository.findById(userId);
    const balance = user.points - totalPrice;
    if (balance < 0) {
      throw new BadRequestError('잔액부족');
    }

    // 3. 트랜잭션으로 포인트&카트삭제&주문추가 3개 묶기
    const order = await this.orderRepository.createOrder(
      userId,
      totalPrice,
      restaurant.ownerId,
      restaurant.restaurantId,
      cartItems,
      cart.cartId,
    );
    const orderItems = order.orderItems.map((item) => {
      return {
        orderItemId: item.orderItemId,
        menuId: item.menuId,
        menuName: item.menu.name,
        price: item.price,
        quantity: item.quantity,
      };
    });
    return {
      customerId: order.customerId,
      orderId: order.orderId,
      restaurantName: order.restaurant.name,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      totalPrice,
      balance: order.points,
      orderItems,
    };
  };
}

export default OrderService;
