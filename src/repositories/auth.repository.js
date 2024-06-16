class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findRefreshTokenByUserId = async (userId) => {
    return await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
  };

  updateOrCreateToken = async (userId, refreshToken) => {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      return await this.prisma.refreshToken.update({
        where: { refreshTokenId: existingToken.refreshTokenId },
        data: { refreshToken },
      });
    } else {
      return await this.prisma.refreshToken.create({
        data: { userId, refreshToken },
      });
    }
  };

  deleteTokenByUserId = async (userId) => {
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });
    if (existingToken) {
      await this.prisma.refreshToken.delete({
        where: { refreshTokenId: existingToken.refreshTokenId },
      });
      return { refreshTokenId: existingToken.refreshTokenId };
    }
    return null;
  };

  updateToken = async (userId, refreshToken) => {
    return await this.prisma.refreshToken.upsert({
      where: { userId: userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  };
}

export default AuthRepository;