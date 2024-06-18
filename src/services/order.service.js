import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../errors/http.error.js';
import { USER_TYPE } from '../constants/user.constant.js';

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
      throw new BadRequestError(MESSAGES.ORDER.CREATE.EMPTY);
    }

    const cartItems = await this.cartRepository.getAllCartItem(cart.cartId);
    if (!cartItems) {
      throw new BadRequestError(MESSAGES.ORDER.CREATE.EMPTY);
    }

    // 1. 주문 제대로 됐는지 확인 - 만약 식당이 없으면 에러
    const restaurant = await this.restaurantRepository.getRestaurantById(
      cart.restaurantId,
    );
    if (!restaurant) {
      throw new NotFoundError(MESSAGES.ORDER.CREATE.RESTAURANT_NOT_FOUND);
    }

    // 2. 메뉴별 가격 더하기, 메뉴 없으면 에러
    let totalPrice = 0;
    for (let item of cartItems) {
      const menu = await this.menuRepository.getMenuById(item.menuId);

      if (!menu) {
        throw new NotFoundError(MESSAGES.ORDER.CREATE.MENU_NOT_FOUND);
      }
      totalPrice += item.quantity * menu.price;
    }

    // 3. 포인트 있는지 확인 - 모자라면 에러
    const user = await this.userRepository.findById(userId);
    const balance = user.points - totalPrice;
    if (balance < 0) {
      throw new BadRequestError(MESSAGES.ORDER.CREATE.INSUFFICIENT);
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

  // 주문내역 상세조회
  getOrderById = async (userId, userType, orderId) => {
    //만약에 유저라면 본인의 주문정보 중, 사장이라면 가게의 주문정보 중 가져옴
    let order;
    if (userType == USER_TYPE.CUSTOMER) {
      order = await this.orderRepository.getOrderByUserId(userId, orderId);
    } else {
      const restaurant =
        await this.restaurantRepository.existedRestaurant(userId);
      if (!restaurant) {
        throw new NotFoundError(MESSAGES.ORDER.GET_ORDER.NOT_FOUND);
      }
      order = await this.orderRepository.getOrderByRestaurantId(
        restaurant.restaurantId,
        orderId,
      );
    }
    if (!order) {
      throw new NotFoundError(MESSAGES.ORDER.GET_ORDER.NOT_FOUND);
    }
    const orderItems = order.orderItems.map((cur) => {
      return {
        orderItemId: cur.orderItemId,
        menuId: cur.menu.menuId,
        menuName: cur.menu.name,
        price: cur.price,
        quantity: cur.quantity,
      };
    });
    return {
      orderId: order.orderId,
      restaurantId: order.restaurantId,
      restaurantName: order.restaurant.name,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      orderItems: orderItems,
    };
  };
}

export default OrderService;
