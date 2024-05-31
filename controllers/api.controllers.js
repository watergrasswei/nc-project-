const { selectTopics, selectArticle, selectArticles, selectComments } = require("../models/api.models");
const endpoints = require("../endpoints.json");

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

const getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};

const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (!Number.isInteger(parseInt(article_id))) {
    return res.status(400).send({ msg: "Invalid article ID format" });
  }
  selectArticle(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article not found" });
      } else return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) =>{ 
  selectArticles().then( (articles)=>{return res.status(200).send({articles})})
.catch((err) => {
  next(err);})
}

const getComments = (req,res,next) =>{
  const { article_id } = req.params;
  selectComments(article_id).then((comments)=>{return res.status(200).send({comments})})
  .catch(next)
}


module.exports = { getTopics, getApi, getArticle, getArticles, getComments};
