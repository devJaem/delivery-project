import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';
class RestaurantService {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    // 목록 조회
    getAllRestaurant = async () => {
        const restaurants = await this.restaurantRepository.getAllRestaurant();
        console.log(restaurants);
        return restaurants.map((restaurant) => {
            return {
                restaurantId: restaurant.restaurantId,
                ownerId: restaurant.ownerId,
                name: restaurant.name,
                address: restaurant.address,
                category: restaurant.category,
                description: restaurant.description,
                createdAt: restaurant.createdAt,
                updatedAt: restaurant.updatedAt,
            }
        });
    }
    // 상세 조회
    getRestaurantById = async (id) => {

        const restaurant = await this.restaurantRepository.getRestaurantById(id);

        return {
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 생성
    createRestaurant = async (user, createrestaurant) => {
        //사장님의 이름(아이디)을 가진 음식점이 2개 이상이라면 에러처리
        const existedRestaurant = await this.restaurantRepository.existedRestaurant(user);
        console.log(existedRestaurant)
        if (existedRestaurant >= 1) throw new Error('2개 이상의 업장을 가질 수 없습니다.');

        if (user.role !== "OWNER") throw new Error('사장님만 접근할수 있습니다.');
        const restaurant = await this.restaurantRepository.createRestaurant(user, createrestaurant);
        return {
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 수정
    putRestaurant = async (id, user, changeRestaurant) => {


        const existedRestaurant = await this.restaurantRepository.getRestaurantById(id);

        console.log(existedRestaurant);
        if (!existedRestaurant) throw new Error('해당 음식점이 없습니다.');

        const restaurant = await this.restaurantRepository.putRestaurant(id, user, changeRestaurant);

        return {
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 삭제
    deleteRestaurant = async (id, user) => {
        const existedRestaurant = await this.restaurantRepository.existedRestaurant(user);
        if (!existedRestaurant) throw new Error('해당 음식점이 없습니다.');
        const restaurant = await this.restaurantRepository.deleteRestaurant(id, user);

        return {
            restaurant
        }
    }
}

export default RestaurantService