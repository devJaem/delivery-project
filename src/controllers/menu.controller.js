import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { uploadToS3 } from '../middlewares/image-upload-middleware.js';

class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  createMenu = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { restaurantId } = req.params;
      const createMenu = req.body;
      const imageUrl = await uploadToS3(req.file);
      const menu = await this.menuService.createMenu(
        userId,
        +restaurantId,
        createMenu,
        imageUrl,
      );
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.MENU.CREATE_MENU.SUCCEED,
        data: menu,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllMenu = async (req, res, next) => {
    const { userId } = req.user;
    const { restaurantId } = req.params;

    const menu = await this.menuService.getAllMenu(+restaurantId);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.MENU.GET_MENU.SUCCEED,
      data: menu,
    });
  };

  getMenuById = async (req, res, next) => {
    const { userId } = req.user;
    const { menuId } = req.params;

    const menu = await this.menuService.getMenuById(+menuId);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.MENU.GET_MENU.SUCCEED,
      data: menu,
    });
  }
}

export default MenuController;
