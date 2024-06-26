class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { userId: userId },
    });
  };

  findOne = async (email) => {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  };

  createUser = async (email, password, nickName, profilePicture, userType) => {
    return await this.prisma.user.create({
      data: {
        email,
        password,
        nickName,
        profilePicture,
        userType,
        points: 1000000,
      },
    });
  };

  updateUser = async (userId, updateData) => {
    return await this.prisma.user.update({
      where: { userId: userId },
      data: updateData,
    });
  };

  deleteUser = async (userId) => {
    return await this.prisma.user.delete({
      where: { userId: userId },
    });
  };

  verifyUserEmail = async (email) => {
    return await this.prisma.user.update({
      where: { email: email },
      data: {
        emailVerified: true,
      },
    });
  };
}

export default UserRepository;
