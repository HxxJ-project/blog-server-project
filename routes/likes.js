const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const { Like } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware.js');

// 좋아요
router.put('/posts/:postId/likes', authMiddleware, async (req, res) => {
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
    return res.json({ Message: '좋아요 + 1👏' });
  } else {
    await Post.decrement({ likes: 1 }, { where: { postId } });
    await likeCheck.destroy();
    return res.json({ Message: '좋아요 - 1😥' });
  }
});

// 내가 좋아요 누른 포스트 조회
router.get('/posts/:userId/likes', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const myLike = await Like.findAll({
      where: {
        userId: Number(userId),
      },
    });

    if (!myLike) {
      return res.status(404).send({
        errorMessage: '좋아요한 포스트가 없습니다.',
      });
    }
    return res.json(myLike);
  } catch {
    res
      .status(400)
      .send({ errorMessage: '잘못된 접근입니다. (myLike 조회 부분)' });
  }
});

module.exports = router;
