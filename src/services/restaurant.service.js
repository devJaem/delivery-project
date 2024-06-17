import { MESSAGES } from '../constants/message.constant.js';
import { ConflictError, NotFoundError } from '../errors/http.error.js';

class RestaurantService {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    // 목록 조회
    getAllRestaurant = async (sort) => {
        sort = sort?.toLowerCase();
        if (sort !== 'desc' && sort !== 'asc') {
            sort = 'desc';
        }
        const restaurants = await this.restaurantRepository.getAllRestaurant(sort);
        return restaurants.map((restaurant) => {
            return {
                restaurantId: restaurant.restaurantId,
                ownerId: restaurant.ownerId,
                name: restaurant.name,
                address: restaurant.address,
                category: restaurant.category,
                description: restaurant.description,
                //"restaurantProfile": "파일",
                createdAt: restaurant.createdAt,
                updatedAt: restaurant.updatedAt,
            }
        });
    }
    // 상세 조회
    getRestaurantById = async (restaurantId) => {
        const restaurant = await this.restaurantRepository.getRestaurantById(restaurantId);
        if (!restaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        return {
            restaurantId: restaurant.restaurantId,
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            // "restaurantProfile": "파일",
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 생성
    createRestaurant = async (user, createrestaurant) => {
        //사장님의 이름(아이디)을 가진 음식점이 2개 이상이라면 에러처리
        const existedRestaurant = await this.restaurantRepository.existedRestaurant(user);
        if (existedRestaurant >= 1) throw new ConflictError(MESSAGES.RESTAURANT.MADE.FAILED.DUPLICATE);
        const restaurant = await this.restaurantRepository.createRestaurant(user, createrestaurant);
        return {
            restaurantId: restaurant.restaurantId,
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            restaurantProfile: restaurant.restaurantProfile,
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 수정
    putRestaurant = async (restaurantId, user, changeRestaurant) => {
        const existedRestaurant = await this.restaurantRepository.getRestaurantById(restaurantId);
        if (!existedRestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        const restaurant = await this.restaurantRepository.putRestaurant(restaurantId, user, changeRestaurant);
        return {
            restaurantId: restaurant.restaurantId,
            ownerId: restaurant.ownerId,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            description: restaurant.description,
            restaurantProfile: restaurant.restaurantProfile,
            createdAt: restaurant.createdAt,
            updatedAt: restaurant.updatedAt,
        };
    }
    // 삭제
    deleteRestaurant = async (restaurantId, user) => {
        const existedRestaurant = await this.restaurantRepository.existedRestaurant(user);
        if (!existedRestaurant) throw new NotFoundError(MESSAGES.RESTAURANT.GET_MORE.NOT_FOUND);
        const restaurant = await this.restaurantRepository.deleteRestaurant(restaurantId, user);
        return {
            restaurant
        }
    }
}

export default RestaurantService