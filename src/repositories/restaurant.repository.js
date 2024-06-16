class RestaurantRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    // 목록 조회
    getAllRestaurant = async () => {
        const restaurants = await this.prisma.Restaurant.findMany({
            // 순서 고려  
        })
        return restaurants
    }
    // 상세 조회
    getRestaurantById = async (id) => {

        const restaurant = await this.prisma.Restaurant.findUnique({
            where: { restaurantId: +id }
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
    putRestaurant = async (id, user, changeRestaurant) => {

        const { name, address, category, description } = changeRestaurant;
        const restaurant = await this.prisma.Restaurant.update({
            where: {
                restaurantId: +id,
                ownerId: user.userId
            },
            data: {
                ...(name && { name }),
                ...(address && { address }),
                ...(category && { category }),
                ...(description && { description }),
            },

        })
        console.log(restaurant);
        return restaurant
    }
    // 삭제
    deleteRestaurant = async (id, user) => {
        // 삭제 조건
        // userid와 restaurantid가 일치한지
        const restaurant = await this.prisma.Restaurant.delete({
            where: {
                restaurantId: +id,
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