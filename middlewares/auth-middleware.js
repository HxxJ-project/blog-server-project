const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const cookieParser = require("cookie-parser");
const SECRET_KEY = `jeonghoon`;

router.use(cookieParser());

module.exports = async (req, res, next) => {
  const { cookie } = req.headers;
  const [authType, authToken] = (cookie || "").split("=");
  // const authToken = req.cookies.token;

  if (!authToken || authType !== "token") {
    res.status(400).json({
      errorMessage: "로그인 후 사용이 가능한 API 입니다.",
    });
    return;
  }

  // 복호화 및 검증
  try {
    const { id } = jwt.verify(authToken, SECRET_KEY);
    User.findByPk(id).then((User) => {
      // console.log("res.locals.user = ", res.locals.user);
      // console.log("User.userId = ", User.userId);
      res.locals.user = User.userId;
      next();
    });
  } catch (error) {
    res.status(400).json({
      errorMessage: "로그인 후 사용이 가능한 API 입니다.",
    });
    return;
  }

  return;
};
