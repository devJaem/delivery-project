import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../errors/http.error.js';

class MenuService {
  constructor(menuRepository, restaurantRepository) {
    this.menuRepository = menuRepository;
    this.restaurantRepository = restaurantRepository;
  }

  createMenu = async (userId, restaurantId, createMenu, imageUrl) => {
    //가격 범위 비교
    if (+createMenu.price > 100000 || +createMenu.price < 100) {
      throw new BadRequestError(MESSAGES.MENU.COMMON.PRICE.MIN_MAX);
    }

    //사장 본인의 음식점이 맞는지 확인 필요
    const restaurant =
      await this.restaurantRepository.getRestaurantById(restaurantId);
    if (!restaurant || restaurant.ownerId != userId) {
      throw new NotFoundError(MESSAGES.MENU.CREATE_MENU.NOT_FOUND);
    }

    //음식점 내에 같은 이름의 메뉴 존재하는지 확인
    const menu = await this.menuRepository.findAllMenu(restaurantId);
    if (menu.map((cur) => cur.name).includes(createMenu.menuName)) {
      throw new ConflictError(MESSAGES.MENU.COMMON.MENU_NAME.DUPLICATED);
    }

    // 메뉴 생성 및 반환
    const newMenu = await this.menuRepository.createMenu(
      restaurantId,
      createMenu.menuName,
      +createMenu.price,
      createMenu.description,
      imageUrl,
    );

    const {
      name: menuName,
      price,
      description,
      createdAt,
      updatedAt,
    } = newMenu;
    const restaurantName = newMenu.restaurant.name;

    return {
      restaurantName,
      menuName,
      imageUrl,
      price,
      description,
      createdAt,
      updatedAt,
    };
  };

  getAllMenu = async (restaurantId) => {
    const restaurant =
      await this.restaurantRepository.getRestaurantById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError(MESSAGES.MENU.GET_ALL_MENU.NOT_FOUND);
    }

    const menu = await this.menuRepository.getAllMenu(restaurantId);
    return menu;
  };

  getMenuById = async (menuId) => {
    const menu = await this.menuRepository.getMenuById(menuId);
    if (!menu) {
      throw new NotFoundError(MESSAGES.MENU.GET_MENU.NOT_FOUND);
    }
    return {
      menuId: menu.menuId,
      restaurantId: menu.restaurantId,
      restaurantName: menu.restaurant.name,
      menuName: menu.name,
      imageURL: menu.imageURL,
      price: menu.price,
      describtion: menu.description,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  };
}

export default MenuService;
