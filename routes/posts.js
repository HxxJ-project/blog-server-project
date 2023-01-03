const express = require('express');
const router = express.Router();
// const { Op } = require("sequelize");
const { Post } = require('../models');
const { Like } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware.js');
// const cookieParser = require("cookie-parser");
// const SECRET_KEY = `jeonghoon`;

// 전체 게시글 목록 조회
router.get('/posts', async (req, res) => {
  const getAllPosts = await Post.findAll({
    attributes: ['postId', 'title', 'likes'],
  }); // posts

  res.status(200).json({ getAllPosts }); //verb가 리턴값의 이름에 붙는것은 좋은 네이밍 컨벤션이 아니다. posts
});

// 게시글 작성
router.post('/posts/', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const userId = res.locals.user;

  if (!title.length || !content.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: '빈칸을 채워주세요!' });
  }

  await Post.create({
    title,
    content,
    userId,
  });

  res.json({ Message: '포스트 작성이 완료되었습니다👏' });
});

// 게시글 조회
router.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const getOnePost = await Post.findOne({
      where: {
        postId: Number(postId),
      },
    });
    if (!getOnePost) {
      res.status(404).send({
        errorMessage: '잘못된 url 입니다. (postId가 없는 상황).',
      });
      return;
    }
    return res.json(getOnePost);
  } catch {
    res.status(400).send({
      errorMessage: '잘못된 접근입니다.',
    });
  }
});

// 4. 게시글 수정 (심화과정 패스)
// router.put("/posts/:postsId", authMiddleware, async (req, res) => {
//   const { postsId } = req.params;
//   const { description, password } = req.body;

//   // const editPosts = await Posts.findById(id);
//   // 이런 쿼리의 경우는 레코드의 개수(쿼리 결과 리절트의 개수)로 비밀버호 일치 여부를 판단
//   // const editPosts = await Posts.find({ postsId, password });
//   // const pw = editPosts[0].password;
//   const editPosts = await Post.find({ postsId });
//   const pw = editPosts[0].password;

//   try {
//     if (!pw || !description.length) {
//       return res.status(400).json({
//         success: false,
//         errorMessage: "잘못된 접근입니다.",
//       });
//     } else if (pw != password) {
//       return res.status(400).json({
//         success: false,
//         errorMessage: "비밀번호를 확인해 주세요.",
//       });
//     } else if (editPosts.length && pw == password) {
//       await Post.updateOne(
//         { postsId: postsId },
//         { $set: { description: description } }
//       );
//     }
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.log("잘못된 접근입니다.", `Error: ${err.message}`);
//   }
// });

// // 5. 게시글 삭제 (심화과정 패스)
// router.delete("/posts/:postsId", authMiddleware, async (req, res) => {
//   const { postsId } = req.params;
//   const { password } = req.body;

//   const deletePosts = await Post.find({ postsId, password });
//   const pw = deletePosts[0].password;

//   try {
//     // if (postsId)
//     if (!pw || pw != password) {
//       return res.status(400).json({
//         success: false,
//         errorMessage: "비밀번호를 확인해 주세요.",
//       });
//     } else if (deletePosts.length && pw == password) {
//       await Post.deleteOne({ postsId });
//     }
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.log("잘못된 접근입니다.", `Error: ${err.message}`);
//   }
// });

module.exports = router;
