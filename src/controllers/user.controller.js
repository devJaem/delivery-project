import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { uploadToS3 } from '../middlewares/image-upload-middleware.js';
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getMyProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await this.userService.getMyProfile(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.getUserProfile(parseInt(userId));
      return res.status(200).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_USER.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const tokens = await this.userService.generateTokens(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.TOKEN.SUCCEED,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const result = await this.userService.deleteToken(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  updateMyProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const profilePictureUrl = req.file ? await uploadToS3(req.file) : undefined;
      const updatedData = { ...req.body, profilePicture: profilePictureUrl };
      const user = await this.userService.updateMyProfile(userId, updatedData);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.UPDATE_ME.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}



export default UserController;
