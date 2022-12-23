const express = require("express");
const router = express.Router();
const { Post } = require("../models");
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
    await Post.increment({ likes: 1 }, { where: { postId } });
    await Like.create({
      check: true,
      userId,
      postId,
    });
    return res.json({ Message: "좋아요 + 1👏" });
  } else {
    await Post.decrement({ likes: 1 }, { where: { postId } });
    await likeCheck.destroy();
    return res.json({ Message: "좋아요 - 1😥" });
  }
  // return res.json({ Message: "like 끝부분" });
});

module.exports = router;
