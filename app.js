const express = require("express");
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json())

const {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getComments,
  postComment,
  patchArticleVotes,
  deleteComment
} = require("./controllers/api.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', deleteComment);






app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
