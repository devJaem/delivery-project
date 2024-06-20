class RestaurantRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 목록 조회
  getAllRestaurant = async (sort) => {
    const restaurants = await this.prisma.Restaurant.findMany({
      orderBy: {
        createdAt: sort,
      },
    });
    return restaurants;
  };
  // 상세 조회
  getRestaurantById = async (restaurantId) => {
    const restaurant = await this.prisma.Restaurant.findUnique({
      where: { restaurantId: +restaurantId },
    });
    return restaurant;
  };
  // 생성
  createRestaurant = async (user, createrestaurant) => {
    console.log('----');
    console.log(createrestaurant);
    const { name, address, category, description, restaurantPicture } =
      createrestaurant;
    const restaurant = await this.prisma.Restaurant.create({
      data: {
        name,
        address,
        category,
        description,
        restaurantPicture,
        owner: {
          connect: {
            userId: user.userId,
          },
        },
      },
    });
    return restaurant;
  };
  // 수정
  putRestaurant = async (restaurantId, user, changeRestaurant) => {
    const { name, address, category, description, restaurantPicture } =
      changeRestaurant;
    const restaurant = await this.prisma.Restaurant.update({
      where: {
        restaurantId: +restaurantId,
        ownerId: user.userId,
      },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(category && { category }),
        ...(description && { description }),
        ...(restaurantPicture && { restaurantPicture }),
      },
    });
    return restaurant;
  };
  // 삭제
  deleteRestaurant = async (restaurantId, user) => {
    const restaurant = await this.prisma.Restaurant.delete({
      where: {
        restaurantId: +restaurantId,
        ownerId: user.userId,
      },
    });
    return restaurant.restaurantId;
  };
  // 사장님의 중복 음식점 찾기
  existedRestaurant = async (userId) => {
    const restaurant = await this.prisma.Restaurant.findFirst({
      where: { ownerId: userId },
    });
    return restaurant;
  };
}

export default RestaurantRepository;
