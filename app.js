const express = require("express");
const app = express();
const port = 5000;

const tokensRouter = require("./routes/token.js");
const signsRouter = require("./routes/sign.js");
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const likesRouter = require("./routes/likes.js");

app.use(express.json());
app.use("/api", [
  tokensRouter,
  signsRouter,
  postsRouter,
  commentsRouter,
  likesRouter,
]);

app.get("/", (req, res) => {
  res.status(200).send("여기는 index 페이지");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
