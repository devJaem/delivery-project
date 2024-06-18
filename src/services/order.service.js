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
    const cart = this.cartRepository.getCartById(userId);
    if (!cart) {
      throw new BadRequestError('주문할게없음');
    }
    const cartItems = this.cartRepository.getAllCartItem(cart.cartId);
    if (!cartItems) {
      throw new BadRequestError('주문할게없음');
    }

    // 1. 주문 제대로 됐는지 확인 - 만약 식당이 없으면 에러
    const restaurant = this.restaurantRepository.getRestaurantById(
      cart.restaurantId,
    );
    if (!restaurant) {
      throw new BadRequestError('식당 사라짐');
    }

    // 2. 메뉴별 가격 더하기, 메뉴 없으면 에러
    let totalPrice = 0;
    cartItems.forEach((item) => {
      const menu = this.menuRepository.getMenuById(item.menuId);
      totalPrice += item.quantity * menu.price;
      if (!menu) {
        throw new BadRequestError('메뉴 사라짐');
      }
    });

    // 3. 포인트 있는지 확인 - 모자라면 에러
    const user = this.userRepository.findById(userId);
    if (user.points - totalPrice < 0) {
      throw new BadRequestError('잔액부족');
    }

    // // 3. 트랜잭션으로 포인트&카트삭제&주문추가 3개 묶기
    // const order = this.orderRepository.createOrder(userId);
  };
}

export default OrderService;
