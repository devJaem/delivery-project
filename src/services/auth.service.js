import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.constant.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  HASH_SALT_ROUNDS,
} from '../constants/auth.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from '../errors/http.error.js';
import {
  generateEmailVerificationToken,
  sendEmail
} from '../utils/email.js'

class AuthService {
  constructor(authRepository, userRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  signUp = async (createUser, profilePictureUrl) => {
    const existingUser = await this.userRepository.findOne(createUser.email);
    if (existingUser) {
      throw new ConflictError(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    const hashPassword = await bcrypt.hash(
      createUser.password,
      parseInt(HASH_SALT_ROUNDS),
    );
    const newUser = await this.userRepository.createUser(
      createUser.email,
      hashPassword,
      createUser.nickName,
      profilePictureUrl,
      createUser.userType,
    );

    const { userId, email, nickName, createdAt, updatedAt } = newUser;

    return {
      userId,
      email,
      nickName,
      createdAt,
      updatedAt,
    };
  };

  signIn = async (loginUser) => {
    const user = await this.userRepository.findOne(loginUser.email);
    if (!user) {
      throw new UnauthorizedError(
        MESSAGES.AUTH.COMMON.INVALID_ACCOUNT_INFORMATION,
      );
    }

    const match = await bcrypt.compare(loginUser.password, user.password);
    if (!match) {
      throw new UnauthorizedError(
        MESSAGES.AUTH.COMMON.INVALID_ACCOUNT_INFORMATION,
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedError(
        MESSAGES.AUTH.COMMON.EMAIL.NOT_VERIFIED,
      );
    }

    const accessToken = jwt.sign(
      {
        userId: user.userId,
        userType: user.userType,
      },
      ENV.ACCESS_KEY,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        userType: user.userType,
      },
      ENV.REFRESH_KEY,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    await this.authRepository.updateOrCreateToken(user.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  };

  deleteToken = async (userId) => {
    const result = await this.authRepository.deleteTokenByUserId(userId);
    if (!result) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    return { userId };
  };

  sendVerificationEmail = async (email) => {
    const { token, expires } = generateEmailVerificationToken();
    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new BadRequestError(MESSAGES.AUTH.COMMON.EMAIL.NOT_FOUND);
    }

    await this.authRepository.upsertEmailVerification(user.userId, token, expires);

    const mailOptions = {
      from: ENV.EMAIL_ADDRESS,
      to: email,
      subject: 'Verify your email address',
      html: `<p>Your verification code is: ${token}</p>
              <p>This code will expire on ${expires}.</p>`,
    };

    await sendEmail(mailOptions);
  };

  verifyEmail = async (token) => {
    const validToken = await this.authRepository.findEmailVerificationTokenWithUser(token);
    if (!validToken || validToken.expires < new Date()) {
      throw new UnauthorizedError(MESSAGES.AUTH.COMMON.JWT.DISCARDED_TOKEN);
    }

    await this.userRepository.verifyUserEmail(validToken.user.email);

    await this.authRepository.deleteEmailVerificationToken(token);
  };
}

export default AuthService;
