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

  createMenu = async (userId, restaurantId, createMenu, menuPicture) => {
    //가격 범위 비교
    if (+createMenu.price > 100000 || +createMenu.price < 100) {
      throw new BadRequestError(MESSAGES.MENU.COMMON.PRICE.MIN_MAX);
    }

    //사장 본인의 음식점이 맞는지 검증
    const restaurant =
      await this.restaurantRepository.getRestaurantById(restaurantId);
    if (!restaurant || restaurant.ownerId != userId) {
      throw new NotFoundError(MESSAGES.MENU.CREATE_MENU.NOT_FOUND);
    }

    //음식점 내에 같은 이름의 메뉴 존재하는지 검증
    const menu = await this.menuRepository.getAllMenu(restaurantId);
    if (menu.map((cur) => cur.name).includes(createMenu.menuName)) {
      throw new ConflictError(MESSAGES.MENU.COMMON.MENU_NAME.DUPLICATED);
    }

    // 메뉴 생성 및 반환
    const newMenu = await this.menuRepository.createMenu(
      restaurantId,
      createMenu.menuName,
      +createMenu.price,
      createMenu.description,
      menuPicture,
    );

    const {
      menuId,
      name: menuName,
      price,
      description,
      createdAt,
      updatedAt,
    } = newMenu;
    const restaurantName = newMenu.restaurant.name;

    return {
      menuId,
      restaurantName,
      menuName,
      menuPicture,
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
      menuPicture: menu.menuPicture,
      price: menu.price,
      describtion: menu.description,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  };

  updateMenu = async (userId, menuId, updateMenu, menuPicture) => {
    //해당 가게가 사장의 가게인지 & 존재하는지 검증
    const menu = await this.menuRepository.getMenuById(menuId);
    if (!menu || menu.restaurant.ownerId != userId) {
      throw new NotFoundError(MESSAGES.MENU.UPDATE_MENU.NOT_FOUND);
    }

    //수정할 내용이 모두 없을 경우 에러
    if (
      !updateMenu.menuName &&
      !updateMenu.price &&
      !updateMenu.description &&
      !menuPicture
    ) {
      throw new BadRequestError(MESSAGES.MENU.UPDATE_MENU.REQUIRED);
    }

    //가격 범위 비교
    if (
      updateMenu.price &&
      (+updateMenu.price > 100000 || +updateMenu.price < 100)
    ) {
      throw new BadRequestError(MESSAGES.MENU.COMMON.PRICE.MIN_MAX);
    }

    // 음식점 이름 수정전/후 같을 경우
    if (updateMenu.menuName && updateMenu.menuName == menu.name) {
      throw new BadRequestError(MESSAGES.MENU.UPDATE_MENU.NAME);
    }

    //음식점 내에 같은 이름의 메뉴 존재하는지 검증
    const allMenu = await this.menuRepository.getAllMenu(menu.restaurantId);
    if (
      updateMenu.menuName &&
      allMenu.map((cur) => cur.name).includes(updateMenu.menuName)
    ) {
      throw new ConflictError(MESSAGES.MENU.COMMON.MENU_NAME.DUPLICATED);
    }

    //데이터 수정
    if (menuPicture == null) {
      menuPicture = menu.menuPicture;
    }
    const updatedMenu = await this.menuRepository.updateMenu(
      menuId,
      updateMenu.menuName ? updateMenu.menuName : menu.name,
      updateMenu.price ? +updateMenu.price : menu.price,
      updateMenu.description ? updateMenu.description : menu.description,
      menuPicture,
    );

    const {
      name: menuName,
      price,
      description,
      createdAt,
      updatedAt,
    } = updatedMenu;
    const restaurantName = updatedMenu.restaurant.name;

    return {
      menuId,
      restaurantName,
      menuName,
      menuPicture,
      price,
      description,
      createdAt,
      updatedAt,
    };
  };

  deleteMenu = async (userId, menuId) => {
    //해당 메뉴가 없을 경우 에러
    const menu = await this.menuRepository.getMenuById(menuId);
    if (!menu) {
      throw new NotFoundError(MESSAGES.MENU.GET_MENU.NOT_FOUND);
    }

    //사장 본인의 음식점이 맞는지 검증
    const restaurant = await this.restaurantRepository.getRestaurantById(
      menu.restaurantId,
    );
    if (!restaurant || restaurant.ownerId != userId) {
      throw new NotFoundError(MESSAGES.MENU.DELETE_MENU.NOT_FOUND);
    }
    const deletedMenu = await this.menuRepository.deleteMenu(menuId);
    return { menuId: deletedMenu.menuId };
  };
}

export default MenuService;
