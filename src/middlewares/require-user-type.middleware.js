import { MESSAGES } from '../constants/message.constant.js';
import { ForbiddenError } from '../errors/http.error.js';

const requireType = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userType = req.user.userType;
      if (!allowedRoles.includes(userType)) {
        throw new ForbiddenError(MESSAGES.AUTH.COMMON.FORBIDDEN);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { requireType };
