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
    ownerId,
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

        //업장 포인트 증가
        const ownerPoint = await tx.user.update({
          where: {
            userId: ownerId,
          },
          data: {
            points: {
              increment: +totalPrice,
            },
          },
        });
        console.log('-------' + ownerPoint.points);
        console.log('----------------' + customerPoint.points);

        //order 생성
        const order = await tx.order.create({
          data: {
            orderStatus: ORDER_STATUS.PREPARING,
            restaurantId,
            customerId,
            totalPrice,
          },
          include: {
            restaurant: {
              select: {
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
            select: {
              orderItemId: true,
              menu: {
                select: {
                  name: true,
                },
              },
              price: true,
              quantity: true,
            },
          });
          orderItems.push(item);
        }

        //cart, cartItem 삭제
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

        return { ...customerPoint, ...order, orderItems };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
    return order;
  };
}

export default OrderRepository;
