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

  // 카트 아이템 생성
  createCartItem = async (userId, menuId) => {
    //해당 가게가 존재하는지 검증
    const menu = await this.menuRepository.getMenuById(menuId);
    if (!menu) {
      throw new NotFoundError('그런메뉴없음');
    }

    //장바구니에 담긴 메뉴가 다른 가게의 메뉴일 경우 아이템 모두 삭제
    const cart = await this.cartRepository.getCartById(userId);
    if (cart && cart.restaurantId != menu.restaurantId) {
      const deletedCartItem = await this.cartRepository.deleteAllItems(
        cart.cartId,
      );
    }

    const cartItem = await this.cartRepository.createCartItem(
      userId,
      menu.restaurantId,
      menuId,
    );
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

  // 카트 아이템 모두 조회
  getAllCartItem = async (userId) => {
    const cart = await this.cartRepository.getCartById(userId);
    const item = await this.cartRepository.getAllCartItem(cart.cartId);

    // 아이템이 없을 경우 빈 객체만 반환
    if (item.length == 0) {
      return {};
    }
    const foundCart = {
      cartId: cart.cartId,
      restaurantName: cart.restaurant.name,
    };

    let cartItems = [];
    item.forEach((cur) => {
      cartItems.push({
        cartItemId: cur.cartItemId,
        menuName: cur.menu.name,
        price: cur.menu.price,
        quantity: cur.quantity,
        createdAt: cur.createdAt,
      });
    });

    return {
      ...foundCart,
      cartItems,
    };
  };

  // 카트 아이템 수량 수정
  updateQuantity = async (cartItemId, quantity) => {
    // 해당 아이템이 존재하는지 검증
    const item = await this.cartRepository.getCartItemById(cartItemId);
    if (!item) {
      throw new NotFoundError('그런메뉴없음');
    }

    const cartItem = await this.cartRepository.updateQuantity(
      cartItemId,
      quantity,
    );
    return {
      cartId: cartItem.cartId,
      cartItemId: cartItem.cartItemId,
      menuName: cartItem.menu.name,
      price: cartItem.menu.price,
      quantity: cartItem.quantity,
      createdAt: cartItem.createdAt,
    };
  };

  // 카트 아이템 삭제
  deleteCartItem = async (cartItemId) => {
    // 해당 아이템이 존재하는지 검증
    const item = await this.cartRepository.getCartItemById(cartItemId);
    if (!item) {
      throw new NotFoundError('그런메뉴없음');
    }

    const deletedItem = await this.cartRepository.deleteItem(cartItemId);
    return {
      cartId: deletedItem.cartId,
      cartItemId: deletedItem.cartItemId,
      menuName: deletedItem.menu.name,
    };
  };

  //카트 아이템 전체 삭제
  deleteAllItems = async (userId) => {
    const cart = await this.cartRepository.getCartById(userId);
    const deletedItems = await this.cartRepository.deleteAllItems(cart.cartId);
    return {
      cartId: cart.cartId,
    };
  };
}

export default CartService;
