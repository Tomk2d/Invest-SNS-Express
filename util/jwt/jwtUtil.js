const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const userKey = process.env.JWT_USER_SECRET_KEY;
if (!userKey) throw Error("Can't get jwt secret key");

const generateUserJwt = (visibleUser, maxAge) => {
  return generateJwt(visibleUser, maxAge, userKey);
};

const generateJwt = (obj, maxAge, key) => {
  const token = jwt.sign(obj, key, {
    expiresIn: maxAge / 1000,
  });

  return token;
};

const parseAuthToken = (token) => {
  const result = parseToken(token, userKey);

  if (!result) return null;

  return {
    id: result.id,
    email: result.email,
    nickname: result.nickname,
    friend: result.friend,
    stock: result.stock,
    likeStock: result.likeStock,
  };
};

const parseToken = (token, key) => {
  if (!token) {
    return null;
  }

  const info = jwt.verify(token, key);
  return info;
};

module.exports = {
  generateJwt,
  parseToken,
  generateUserJwt,
  parseAuthToken,
};
