const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const SECRET_KEY = `jeonghoon`;
const { Op } = require("sequelize");
const { User } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

router.use(cookieParser());

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ nickname }],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  await User.create({ nickname, password });

  res.status(201).send({});
});

// 로그인
router.post("/auth", async (req, res) => {
  try {
    const { nickname, password } = req.body;

    const user = await User.findOne({
      where: {
        nickname,
        password,
      },
    });
    if (!user) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
      });
      return;
    }

    const token = jwt.sign({ id: user.userId }, SECRET_KEY, {
      expiresIn: "60m",
    });
    res.cookie("token", token);
    res.json({ token: token });
  } catch {
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

// 내 정보 조회
router.get("/users/me", authMiddleware, async (req, res) => {
  res.json({ user: res.locals.user });
});

module.exports = router;
