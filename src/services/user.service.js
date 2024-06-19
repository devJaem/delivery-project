import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { NotFoundError, UnauthorizedError } from '../errors/http.error.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
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

  updateMyProfile = async (userId, updatedData, profilePictureUrl) => {
    if (updatedData.checkPassword) {
      delete updatedData.checkPassword;
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        HASH_SALT_ROUNDS,
      );
    }

    if (profilePictureUrl) {
      updatedData.profilePicture = profilePictureUrl;
    }

    const user = await this.userRepository.updateUser(userId, updatedData);

    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }

    const { nickName, profilePicture, updatedAt } = user;

    return {
      nickName,
      profilePicture,
      updatedAt,
    };
  };

  deleteMyProfile = async (userId) => {
    const user = await this.userRepository.deleteUser(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
  };
}

export default UserService;
