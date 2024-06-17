import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../errors/http.error.js';

class CartService {
  constructor(cartRepository, menuRepository) {
    this.cartRepository = cartRepository;
    this.menuRepository = menuRepository;
  }

  createCartItem = async (userId, menuId) => {
    //해당 가게가 존재하는지 검증
    const menu = await this.menuRepository.getMenuById(menuId);
    if (!menu) {
      throw new NotFoundError("그런메뉴없음");
    }

    //장바구니에 담긴 메뉴가 다른 가게의 메뉴일 경우 아이템 모두 삭제
    const cart = await this.cartRepository.getCartById(userId);
    if (cart && cart.restaurantId != menu.restaurantId) {
        const deletedCartItem = await this.cartRepository.deleteCart(cart.cartId);
    }

    const cartItem = await this.cartRepository.createCartItem(userId, menu.restaurantId, menuId);
    return {
        cartId: cartItem.cart.cartId,
        cartItemId: cartItem.cartItem.cartItemId,
        restaurantName: cartItem.cart.restaurant.name,
        menuName: cartItem.cartItem.menu.name,
        price: cartItem.cartItem.menu.price,
        quantity: cartItem.cartItem.quantity,
        createdAt: cartItem.cartItem.createdAt,
    };
  };
}

export default CartService;
