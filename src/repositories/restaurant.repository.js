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
        })
        return restaurants
    }
    // 상세 조회
    getRestaurantById = async (restaurantId) => {
        const restaurant = await this.prisma.Restaurant.findUnique({
            where: { restaurantId: +restaurantId }
        })
        return restaurant;
    }
    // 생성
    createRestaurant = async (user, createrestaurant) => {
        const { name, address, category, description } = createrestaurant;
        const restaurant = await this.prisma.Restaurant.create({
            data: {
                name,
                address,
                category,
                description,
                owner: {
                    connect: {
                        userId: user.userId,
                    }
                }
            }
        })
        return restaurant;
    }
    // 수정
    putRestaurant = async (restaurantId, user, changeRestaurant) => {
        const { name, address, category, description } = changeRestaurant;
        const restaurant = await this.prisma.Restaurant.update({
            where: {
                restaurantId: +restaurantId,
                ownerId: user.userId
            },
            data: {
                ...(name && { name }),
                ...(address && { address }),
                ...(category && { category }),
                ...(description && { description }),
            },
        })
        return restaurant
    }
    // 삭제
    deleteRestaurant = async (restaurantId, user) => {
        const restaurant = await this.prisma.Restaurant.delete({
            where: {
                restaurantId: +restaurantId,
                ownerId: user.userId
            },
        })
        return restaurant.restaurantId;
    }
    // 사장님의 중복 음식점 찾기
    existedRestaurant = async (user) => {
        const restaurant = await this.prisma.Restaurant.count({
            where: { ownerId: user.userId },
        })
        return restaurant;
    }
}

export default RestaurantRepository;