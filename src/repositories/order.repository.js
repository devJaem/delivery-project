import { ORDER_STATUS } from '../constants/order.constants.js';
import { Prisma } from '@prisma/client';

class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 주문 > 포인트 변경 / 주문 생성 / 카트 삭제(미완료)
  createOrder = async (
    customerId,
    totalPrice,
    restaurantId,
    cartItems,
    cartId,
  ) => {
    const order = await this.prisma.$transaction(
      async (tx) => {
        //고객 포인트 차감
        const customerPoint = await tx.user.update({
          where: {
            userId: customerId,
          },
          data: {
            points: {
              decrement: +totalPrice,
            },
          },
          select: {
            points: true,
          },
        });

        //음식점 포인트 증가
        const restaurantPoint = await tx.restaurant.update({
          where: {
            restaurantId: restaurantId,
          },
          data: {
            revenues: {
              increment: +totalPrice,
            },
          },
          select: {
            revenues: true,
          },
        });

        //order 생성
        const order = await tx.order.create({
          data: {
            orderStatus: ORDER_STATUS.PREPARING,
            restaurantId,
            customerId,
            totalPrice,
          },
          include: {
            customer: {
              select: {
                nickName: true,
              },
            },
            restaurant: {
              select: {
                ownerId: true,
                name: true,
              },
            },
          },
        });

        //orderItem 생성
        let orderItems = [];
        for (let i = 0; i < cartItems.length; i++) {
          const item = await tx.orderItem.create({
            data: {
              orderId: order.orderId,
              menuId: cartItems[i].menuId,
              price: cartItems[i].menu.price,
              quantity: cartItems[i].quantity,
            },
            include: {
              menu: {
                select: {
                  name: true,
                },
              },
            },
          });
          orderItems.push(item);
        }

        // cart, cartItem 삭제
        const deletedCartItem = await tx.cartItem.deleteMany({
          where: {
            cartId,
          },
        });
        const deletedCart = await tx.cart.delete({
          where: {
            cartId,
          },
        });

        return { ...customerPoint, ...order, orderItems, ...restaurantPoint };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
    return order;
  };

  //주문내역 상세조회 - by userId
  getOrderByUserId = async (userId, orderId) => {
    return await this.prisma.order.findFirst({
      where: {
        orderId,
        customerId: userId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        orderItems: {
          select: {
            orderItemId: true,
            menu: {
              select: {
                menuId: true,
                name: true,
              },
            },
            price: true,
            quantity: true,
          },
        },
      },
    });
  };

  //주문내역 상세조회 - by restaurantId
  getOrderByRestaurantId = async (restaurantId, orderId) => {
    return await this.prisma.order.findFirst({
      where: {
        orderId,
        restaurantId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        orderItems: {
          select: {
            orderItemId: true,
            menuId: true,
            menu: {
              select: {
                name: true,
              },
            },
            price: true,
            quantity: true,
          },
        },
      },
    });
  };

  //주문내역 조회 - by userId
  getAllOrdersByUserId = async (userId) => {
    return await this.prisma.order.findMany({
      where: {
        customerId: userId,
      },
      include: {
        restaurant: {
          select: {
            ownerId: true,
            name: true,
          },
        },
        customer: {
          select: {
            userId: true,
            nickName: true,
          },
        },
        orderItems: {
          select: {
            orderItemId: true,
            menu: {
              select: {
                menuId: true,
                name: true,
              },
            },
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  //주문내역 조회 - by restaurantId
  getAllOrdersByRestaurantId = async (restaurantId) => {
    return await this.prisma.order.findMany({
      where: {
        restaurantId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            userId: true,
            nickName: true,
          },
        },
        orderItems: {
          select: {
            orderItemId: true,
            menu: {
              select: {
                menuId: true,
                name: true,
              },
            },
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  //주문상태 수정
  updateOrderStatus = async (orderId, orderStatus) => {
    return await this.prisma.order.update({
      where: {
        orderId,
      },
      data: {
        orderStatus,
      },
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });
  };
}

export default OrderRepository;
