class MenuRepository {
    constructor(prisma) {
      this.prisma = prisma;
    }
  
    findRefreshTokenByUserId = async (userId) => {
      return await this.prisma.refreshToken.findFirst({
        where: { userId },
      });
    };

  }
  
  export default MenuRepository;