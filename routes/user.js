const express = require("express");
const router = express.Router();
const validator = require("validator");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { generateUserJwt } = require("../util/jwt/jwtUtil.js");
const User = require("../model/User.js");
const authHandler = require("../middleware/authHandler/authHandler.js");
const search = require('../service/user/userService.js');
dotenv.config();

// 사용자 정보
router.get("/:userId", authHandler, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 회원가입
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;
    const result = await signUp(email, nickname, password);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginInfo = await login(email, password);
    res.cookie("authToken", loginInfo.accessToken, {
      httpOnly: true,
      maxAge: loginInfo.maxAge,
      // secure: true // if https
    });

    loginInfo.user.token = loginInfo.accessToken;
    res.status(201).json(loginInfo.user);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

// 로그아웃
router.post("/logout", authHandler, async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).send({ success: true, message: "Logout Success" });
});

const signUp = async (email, nickname, password) => {
  // validate
  await validateEmail(email);

  // salt
  const hashedPassword = await toHashedPassword(password);

  // save
  const user = new User({
    email: email,
    nickname: nickname,
    password: hashedPassword,
  });

  const result = await user.save();
  return {
    id: result._id,
    email: result.email,
    nickname: result.nickname,
    createdAt: result.createdAt,
  };
};

router.post('/search',async(req, res, next)=>{
  try{
    const data = await search(req.body.nickname);
    res.status(200).json(data);
  }catch(err){
    console.error(err);
  }
})

const login = async (email, password) => {
  try {
    if (!validator.isEmail(email) || !(await isExistByEmail(email))) {
      throw new Error("이메일 혹은 비밀번호가 옳지 않습니다.");
    }

    const user = await User.findOne({
      email: email,
    });

    if (
      !password ||
      !(await bcrypt.compare(password.toString(), user.password))
    ) {
      throw new Error("이메일 혹은 비밀번호가 옳지 않습니다.");
    }

    const visibleUser = {
      id: user._id,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };

    // 3일
    const maxAge = 1000 * 60 * 60 * 24 * 3;

    return {
      accessToken: generateUserJwt(visibleUser, maxAge),
      maxAge: maxAge,
      user: visibleUser,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const toHashedPassword = async (password) => {
  const saltRound = Number(process.env.SALT_ROUND);
  if (saltRound === -1) throw new Error(500, "Sign Up Error");
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const validateEmail = async (email) => {
  if (!email || !validator.isEmail(email))
    throw new Error("올바른 이메일 형식이 아닙니다.");
  if (await isExistByEmail(email))
    throw new Error("해당 이메일은 이미 사용 중 입니다.");
};

const isExistByEmail = async (email) => {
  const result = await User.exists({ email: email });
  return result;
};

module.exports = router;
