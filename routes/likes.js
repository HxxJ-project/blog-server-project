const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { User } = require("../models");
const { Like } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");

// 좋아요
router.put("/posts/:postId/likes", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const userId = res.locals.user;
  const likeCheck = await Like.findOne({
    where: { userId: userId, postId: postId },
  });

  if (!likeCheck) {
    await Like.create({
      check: true,
      userId,
      postId,
    });
  } else {
    await likeCheck.destroy();
  }
  res.json({ Message: "좋아요 + 1👏" });
});

module.exports = router;
