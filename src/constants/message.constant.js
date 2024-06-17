import { MIN_PASSWORD_LENGTH } from './auth.constant.js';

export const MESSAGES = {
  S3: {
    WRONG_EXTENSION: '잘못된 확장자 입니다.',
    UPLOADING_FAIL: '업로드 실패, 관리자에게 문의해 주세요.',
  },
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해 주세요.',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
        DUPLICATED: '이미 가입 된 사용자입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해 주세요.',
        MIN_LENGTH: `비밀번호는 ${MIN_PASSWORD_LENGTH}자리 이상이어야 합니다.`,
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        NOT_MATCHED_WITH_PASSWORD: '입력 한 두 비밀번호가 일치하지 않습니다.',
      },
      NICKNAME: {
        REQUIRED: '닉네임을 입력해 주세요.',
      },
      USER_TYPE: {
        INVALID: '유효하지 않은 사용자 유형입니다.',
        REQUIRED: '사용자 유형을 입력해 주세요.',
      },
      UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
      INVALID_ACCOUNT_INFORMATION: '잘못된 계정 정보입니다.',
      FORBIDDEN: '접근 권한이 없습니다.',
      JWT: {
        NO_TOKEN: '인증 정보가 없습니다.',
        NOT_SUPPORTED_TYPE: '지원하지 않는 인증 방식입니다.',
        EXPIRED: '인증 정보가 만료되었습니다.',
        NO_USER: '인증 정보와 일치하는 사용자가 없습니다.',
        INVALID: '인증 정보가 유효하지 않습니다.',
        DISCARDED_TOKEN: '폐기 된 인증 정보입니다.',
      },
    },
    SIGN_UP: {
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인에 성공했습니다.',
    },
    SIGN_OUT: {
      SUCCEED: '로그아웃에 성공했습니다.',
    },
    TOKEN: {
      SUCCEED: '토큰 재발급에 성공했습니다.',
    },
  },
  USERS: {
    READ_ME: {
      SUCCEED: '내 정보 조회에 성공했습니다.',
    },
    UPDATE_ME: {
      SUCCEED: '내 정보 수정에 성공했습니다.',
      FAIL: '변경할수 없는 정보입니다.',
    },
    READ_USER: {
      SUCCEED: '사용자 정보 조회에 성공했습니다.',
    },
  },
  MENU: {
    COMMON: {
      MENU_NAME: {
        REQUIRED: '메뉴 이름을 입력해주세요.',
        DUPLICATED: '이미 존재하는 메뉴입니다.',
        MAX: '메뉴 이름은 20자 이내로 입력해주세요.',
      },
      PRICE: {
        REQUIRED: '가격을 입력해주세요.',
        IS_NOT_NUM: '가격은 숫자로 입력해주세요.',
        MIN_MAX: '가격은 100원 이상 10만원 이하로 입력해주세요.',
      },
      DESCRIPTION: {
        REQUIRED: '메뉴 설명 입력해주세요.',
        MAX: '메뉴 설명은 50자 이내로 입력해주세요.',
      },
    },
    CREATE_MENU: {
      NOT_FOUND: '해당 가게가 존재하지 않습니다.',
      SUCCEED: '메뉴 생성을 완료했습니다.',
    },
    GET_ALL_MENU: {
      NOT_FOUND: '해당 가게가 존재하지 않습니다.',
      SUCCEED: '메뉴 조회에 성공했습니다.',
    },
    GET_MENU: {
      NOT_FOUND: '해당 메뉴가 존재하지 않습니다.',
      SUCCEED: '메뉴 상세조회에 성공했습니다.',
    },
  },
  RESTAURANT: {
    GET_ALL: {
      SUCCEED: '음식점 목록조회에 성공했습니다.'
    },
    GET_MORE: {
      SUCCEED: '음식점 상세조회에 성공했습니다.'
    },
    CREATE: {
      SUCCEED: '음식점 생성에 성공했습니다.'
    },
    UPDATE: {
      SUCCEED: '음식점 수정에 성공했습니다.'
    },
    DELETE: {
      SUCCEED: '음식점 삭제에 성공했습니다.'
    }
  },
  MENU: {
    CREATE_MENU: {
      SUCCEED: '메뉴 생성을 완료했습니다.',
    },
    CREATE_OPTION: {
      SUCCEED: '옵션 생성을 완료했습니다.',
    }
  }
};
