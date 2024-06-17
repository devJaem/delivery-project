import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from '../errors/http.error.js';

class MenuService {
  constructor(menuRepository /*, restaurantRepository*/) {
    this.menuRepository = menuRepository;
    //this.restaurantRepository = restaurantRepository;
  }

  createMenu = async (userId, restaurantId, createMenu, imageUrl) => {
    // 사장 본인의 음식점이 맞는지 확인 필요 > 레스토랑 조회 api 구현해야함
    // const restaurant = await this.restaurantRepository.findById(restaurantId);
    // if (!restaurant || restaurant.ownerId != userId) {
    //   throw new NotFoundError(MESSAGES.MENU.CREATE_MENU.NOT_FOUND);
    // }

    // 음식점 내에 같은 이름의 메뉴 존재하는지 확인
    const menu = await this.menuRepository.findAllMenu(restaurantId);
    if (menu.map((cur) => cur.name).includes(createMenu.menuName)) {
      throw new ConflictError(MESSAGES.MENU.COMMON.MENU_NAME.DUPLICATED);
    }

    // 메뉴 생성 및 반환
    const newMenu = await this.menuRepository.createMenu(
      restaurantId,
      createMenu.menuName,
      createMenu.price,
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

  createOption = async (userId, menuId, createOption) => {
    // 사장 본인의 음식점이 맞는지 확인 필요 > 레스토랑 조회 api 구현해야함
    const menu = await this.menuRepository.findMenuById(menuId);
    if (!menu || menu.restaurant.ownerId != userId) {
      throw new NotFoundError(MESSAGES.MENU.CREATE_MENU.NOT_FOUND);
    }

    // 메뉴에 같은 이름의 옵션이 존재하는지 확인
    const option = await this.menuRepository.findAllOptions(menuId);
    if (option.map((cur) => cur.name).includes(createOption.optionName)) {
      throw new ConflictError(MESSAGES.MENU.CREATE_OPTION.DUPLICATED);
    }

    // 옵션 생성 및 반환
    const newOption = await this.menuRepository.createOption(
      menuId,
      createOption.optionName,
      createOption.description,
    );
    const { name: optionName, description } = newOption;
    const menuName = newOption.menu.name;

    let select = [];
    createOption.select.forEach(async (name) => {
      const newSelect = await this.menuRepository.createSelect(
        newOption.optionId,
        name,
      );
      select.push({ selectId: newSelect.selectId, select: newSelect.name });
    });

    return {
      menuName,
      optionName,
      description,
      select,
      createdAt,
      updatedAt,
    };
  };
}

export default MenuService;
