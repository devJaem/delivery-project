class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  //카트 아이템 생성
  createCartItem = async (userId, restaurantId, menuId) => {
    const cart = await this.prisma.cart.upsert({
      where: {
        userId,
        restaurantId,
      },
      create: {
        restaurantId,
        userId,
      },
      update: {
        restaurantId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });

    const cartItem = await this.prisma.cartItem.upsert({
      where: {
        cartId_menuId: {
          cartId: cart.cartId,
          menuId,
        },
      },
      create: {
        cart: {
          connect: {
            cartId: cart.cartId,
          },
        },
        menu: {
          connect: {
            menuId,
          },
        },
        quantity: 1,
      },
      update: {
        quantity: {
          increment: 1,
        },
      },
      include: {
        menu: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return { cart, cartItem };
  };

  // 카트 조회
  getCartById = async (userId) => {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });
  };

  //카트 삭제
  deleteCart = async (cartId) => {
    const deletedCartItem = await this.prisma.cartItem.delete({
      where: {
        cartId,
      },
    });
    return deletedCartItem;
  };
}

export default CartRepository;
