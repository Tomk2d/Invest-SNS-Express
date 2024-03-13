const { parseAuthToken } = require("../../util/jwt/jwtUtil");

const authHandler = (req, res, next) => {
  const user = parseAuthToken(req.cookies.authToken);
  if (user) {
    req.user = user;
    return next();
  }
};

module.exports = authHandler;
