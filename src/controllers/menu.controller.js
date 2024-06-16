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
      const user = await this.menuService.createMenu(userId, restaurantId, createMenu, imageUrl);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MenuController;