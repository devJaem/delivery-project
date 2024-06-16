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
}

export default UserRepository;