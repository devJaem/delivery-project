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
      const imageURL = await uploadToS3(req.file);
      const menu = await this.menuService.createMenu(
        userId,
        +restaurantId,
        createMenu,
        imageURL,
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
    try {
      const { userId } = req.user;
      const { restaurantId } = req.params;

      const menu = await this.menuService.getAllMenu(+restaurantId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENU.GET_MENU.SUCCEED,
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  };

  getMenuById = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { menuId } = req.params;

      const menu = await this.menuService.getMenuById(+menuId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENU.GET_MENU.SUCCEED,
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  };

  updateMenu = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { menuId } = req.params;
      const updateMenu = req.body;
      const imageURL = req.file ? await uploadToS3(req.file) : null;

      const menu = await this.menuService.updateMenu(
        userId,
        +menuId,
        updateMenu,
        imageURL,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENU.UPDATE_MENU.SUCCEED,
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteMenu = async (req, res, next) => {
    const { userId } = req.user;
    const { menuId } = req.params;

    const menu = await this.menuService.deleteMenu(userId, +menuId);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.MENU.GET_MENU.SUCCEED,
      data: menu,
    });
  };
}

export default MenuController;
