import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/http.error.js';

const validateToken = async (accessToken, secretKey) => {
  try {
    const payload = jwt.verify(accessToken, secretKey);
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return 'expired';
    } else {
      return 'JsonWebTokenError';
    }
  }
};

/** accessToken 토큰 검증 API **/
const authMiddleware = (userRepository) => async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
    }

    const accessToken = authorizationHeader.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);
    }

    const payload = await validateToken(accessToken, ENV.ACCESS_KEY);
    if (payload === 'expired') {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.EXPIRED);
    } else if (payload === 'JsonWebTokenError') {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.INVALID);
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware, validateToken };
