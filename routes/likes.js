const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { User } = require("../models");
const { Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 좋아요
router.post(
  "/posts/:postId/likes/:userId",
  authMiddleware,
  async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.user;
    const likeCheck = await Like.findOne({
      where: { userId: userId, postId: postId },
    });
    console.log("likeCheck = ", likeCheck);
    if (!likeCheck) {
      await Like.create({
        count: 1,
        check: true,
      });
    } else {
      await Like.update(
        { count: 0, check: false },
        {
          where: { userId: userId, postId: postId },
        }
      );
    }
    res.json({ Message: "좋아요 + 1👏" });
  }
);

module.exports = router;
