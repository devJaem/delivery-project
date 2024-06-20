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

  upsertEmailVerification = async (userId, token, expires) => {
    const existingToken = await this.prisma.emailAuthCode.findFirst({
      where: { token },
    });

    if (existingToken) {
      return await this.prisma.emailAuthCode.update({
        where: { emailCodeId: existingToken.emailCodeId },
        data: { token, expires },
      });
    } else {
      return await this.prisma.emailAuthCode.create({
        data: { userId, token, expires },
      });
    }
  };

  findEmailVerificationTokenWithUser = async (token) => {
    return await this.prisma.emailAuthCode.findFirst({
      where: { token },
      include: { user: true },
    });
  };

  deleteEmailVerificationToken = async (token) => {
    const existingToken = await this.prisma.emailAuthCode.findFirst({
      where: { token },
    });

    return await this.prisma.emailAuthCode.delete({
      where: { emailCodeId: existingToken.emailCodeId },
    });
  };
}

export default AuthRepository;
