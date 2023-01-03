const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const { Comment } = require('../models');
const { User } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware.js');

// 4. 포스트 댓글 조회
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const getCommentId = await Comment.findAll({ attributes: ['commentId'] });
    const getOnePost = await Post.findOne({
      where: {
        postId: Number(postId),
      },
    });
    const getPostComments = await Comment.findAll({
      where: {
        postId: Number(postId),
      },
    });
    // .sort(-getCommentId)
    // .exec();
    if (!getOnePost) {
      res.status(404).send({
        errorMessage: '잘못된 url 입니다. (포스트가 없는 상황).',
      });
      return;
    }
    if (!getPostComments) {
      return res.json({ message: '포스트에 댓글이 없습니다.' });
    }
    return res.json(getPostComments);
  } catch {
    res.status(400).send({
      errorMessage: '잘못된 접근입니다.',
    });
  }
});

// 5. 댓글 작성
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = res.locals.user;

  if (!text.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '댓글을 입력하세요!',
    });
  }

  await Comment.create({
    text,
    userId,
    postId,
  });

  res.json({ Message: '댓글이 작성되었습니다👏' });
});

// 6. 댓글 수정
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = res.locals.user;

    const findCommentId = await Comment.findByPk(commentId);
    const userCheck = await Comment.findOne({
      where: { commentId: commentId, userId: userId },
    });
    console.log('userCheck = ', userCheck);
    if (!findCommentId) {
      return res
        .status(404)
        .json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }
    if (!userCheck) {
      return res.status(401).json({ errorMessage: '댓글 작성자가 아닙니다.' });
    }
    if (!text.length) {
      return res.status(400).json({
        success: false,
        errorMessage: '댓글을 입력하세요!',
      });
    }
    await Comment.update(
      { text: text },
      {
        where: { commentId: commentId },
      },
    );
    res.json({ Message: '댓글이 수정되었습니다👏' });
  },
);

// 7. 댓글 삭제
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    const { postId } = req.params;
    const { commentId } = req.params;
    const userId = res.locals.user;

    const findCommentId = await Comment.findByPk(commentId);
    const userCheck = await Comment.findOne({
      where: { commentId: commentId, userId: userId, postId: postId },
    });
    console.log('userCheck = ', userCheck);
    if (!findCommentId) {
      return res
        .status(404)
        .json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }
    if (!userCheck) {
      return res.status(401).json({ errorMessage: '잘못된 접근입니다.' });
    }
    await userCheck.destroy();
    res.json({ Message: '댓글이 삭제되었습니다👏' });
  },
);

module.exports = router;
