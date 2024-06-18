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
      return res.status(HTTP_STATUS.OK).json({
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

  updateMyProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const updatedData = req.body;

      if (req.file) {
        const profilePictureUrl = await uploadToS3(req.file);
        updatedData.profilePicture = profilePictureUrl; // 프로필 사진 URL을 요청 본문에 추가
      }

      const user = await this.userService.updateMyProfile(userId, updatedData);

      res.status(200).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.UPDATE_ME.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMyProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      await this.userService.deleteMyProfile(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.DELETE_ME.SUCCEED,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;