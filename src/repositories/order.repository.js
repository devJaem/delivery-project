import { ORDER_STATUS } from '../constants/order.constants.js';
import { Prisma } from '@prisma/client';

class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 주문 > 포인트 변경 / 주문 생성 / 카트 삭제
  createOrder = async (
    customerId,
    totalPrice,
    ownerId,
    restaurantId,
    cartItems,
    cartId,
  ) => {
    // const order = await this.prisma.$transaction(
    //   async (tx) => {
          // 고객 포인트 차감
          const customerPoint = await this.prisma.user.update({
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
          console.log('Customer points updated:', customerPoint);

          // // 음식점 포인트 증가
          // const restaurantPoint =
          //  await this.prisma.restaurant.update({
          //   where: {
          //     restaurantId: restaurantId,
          //   },
          //   data: {
          //     revenues: {
          //       increment: +totalPrice,
          //     },
          //   },
          //   select: {
          //     revenues: true,
          //   },
          // });
          // console.log('Restaurant revenues updated:', restaurantPoint);

          // 주문 생성
          const order = await this.prisma.order.create({
            data: {
              orderStatus: 'PREPARING',
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
          console.log('Order created:', order);

          // 주문 항목 생성
          let orderItems = [];
          for (let i = 0; i < cartItems.length; i++) {
            const item = await this.prisma.orderItem.create({
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
            console.log('Order item created:', item);
            orderItems.push(item);
          }

          // 카트 및 카트 항목 삭제
          await this.prisma.cartItem.deleteMany({
            where: {
              cartId,
            },
          });
          await this.prisma.cart.delete({
            where: {
              cartId,
            },
          });
          console.log('Cart and cart items deleted');

          return { ...customerPoint, ...order, orderItems };
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