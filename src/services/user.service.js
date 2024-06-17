import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from '../errors/http.error.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/auth.constant.js';

class UserService {
  constructor(userRepository, authRepository) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  getMyProfile = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    const { email, nickName, userType, profilePicture, createdAt, updatedAt } =
      user;
    return {
      email,
      nickName,
      profilePicture,
      userType,
      createdAt,
      updatedAt,
    };
  };

  getUserProfile = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    const { nickName, userType, profilePicture, createdAt } = user;
    return {
      nickName,
      profilePicture,
      userType,
      createdAt,
    };
  };

  generateTokens = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      { userId: user.userId, userType: user.userType },
      ENV.ACCESS_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const refreshToken = jwt.sign(
      { userId: user.userId, userType: user.userType },
      ENV.REFRESH_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    await this.authRepository.updateOrCreateToken(user.userId, refreshToken);

    return { accessToken, refreshToken };
  };

  deleteToken = async (userId) => {
    const result = await this.authRepository.deleteTokenByUserId(userId);
    if (!result) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    return result;
  };

  updateMyProfile = async (userId, updatedData) => {
    const user = await this.userRepository.updateUser(userId, updatedData);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    const { nickName, userType, profilePicture, updatedAt } = user;
    return {
      nickName,
      profilePicture,
      userType,
      updatedAt,
    };
  };
}

export default UserService;
