const ERROR_PATTERNS = {
  UNAUTHORIZED: {
    status: 401,
    message: "Unauthorized: 유효한 인증 정보가 아닙니다.",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found: 요청한 페이지를 찾을 수 없습니다.",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request: 잘못된 요청입니다.",
  },
  SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error: 서버 통신이 원활하지 않습니다.",
  },
};

module.exports = ERROR_PATTERNS;
