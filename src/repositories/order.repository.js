class OrderRepository {
    constructor(prisma, Prisma) {
      this.prisma = prisma;
      this.Prisma = Prisma;
    }
  
    findById = async (userId) => {
      return await this.prisma.user.findUnique({
        where: { userId: userId },
      });
    };
  }
  
  export default OrderRepository;