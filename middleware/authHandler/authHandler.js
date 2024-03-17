const { parseAuthToken } = require("../../util/jwt/jwtUtil");

const authHandler = (req, res, next) => {
  let token = req.cookies.authToken;
  let headerToken = req.headers.authorization;

  // 토큰이 없고 헤더가 있는 경우
  if (!token && headerToken) {
    token = headerToken.split(" ")[1];
  }
  const user = parseAuthToken(token);
  if (user) {
    req.user = user;
    return next();
  }
};

module.exports = authHandler;
