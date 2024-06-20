import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class AuthController {
  constructor(authService, rankService) {
    this.authService = authService;
    this.rankService = rankService;
  }

  signUp = async (req, res, next) => {
    try {
      const createUser = req.body;
      const profilePictureUrl = req.body.profilePicture;
      const user = await this.authService.signUp(createUser, profilePictureUrl);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const loginUser = req.body;
      const tokens = await this.authService.signIn(loginUser);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const result = await this.authService.deleteToken(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  sendVerificationEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      await this.authService.sendVerificationEmail(email);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.EMAIL.SEND_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req, res, next) => {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.EMAIL.VERIFY_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
