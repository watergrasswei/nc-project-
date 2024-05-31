const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

const selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};

const selectArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

const selectArticles = () => {
  let sqlQuery = `SELECT articles.article_id, articles.author, title, topic, 
articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
`;
  sqlQuery += `ORDER BY created_at DESC`;

  return db.query(sqlQuery).then((res) => {
    return res.rows;
  });
};

const selectComments = (article_id) => {
  const numberArticleId = +article_id;

  if (isNaN(numberArticleId)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID format" });
  }

  const articleCheckQuery = "SELECT * FROM articles WHERE article_id = $1";

  return db
    .query(articleCheckQuery, [article_id])
    .then((articleCheckResult) => {
      if (articleCheckResult.rows.length === 0) {
        // Article does not exist
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      let sqlQuery = `SELECT comments.body, comment_id, comments.votes,
        comments.created_at, comments.author, comments.article_id
        FROM comments 
        LEFT JOIN articles ON comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC`;

      return db.query(sqlQuery, [article_id]);
    })
    .then((commentsResult) => {
      return commentsResult.rows;
    });
};

const insertComment = (article_id, username, body) => {
  const numberArticleId = +article_id;

  if (isNaN(numberArticleId)) {
    return Promise.reject({ status: 400, msg: "Invalid article ID format" });
  }

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }

  const articleCheckQuery = "SELECT * FROM articles WHERE article_id = $1";

  return db
    .query(articleCheckQuery, [article_id])
    .then((articleCheckResult) => {
      if (articleCheckResult.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      const userCheckQuery = "SELECT * FROM users WHERE username = $1";
      return db.query(userCheckQuery, [username]);
    })
    .then((userCheckResult) => {
      if (userCheckResult.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      const insertCommentQuery = `
         INSERT INTO comments (article_id, author, body, votes, created_at)
         VALUES ($1, $2, $3, 0, NOW())
         RETURNING *;
       `;

      return db.query(insertCommentQuery, [article_id, username, body]);
    })

    .then((insertCommentResult) => {
      return insertCommentResult.rows[0];
    });
};


const updateArticleVotes = (article_id, inc_votes) => {
   const numberArticleId = +article_id;
 
   if (isNaN(numberArticleId)) {
     return Promise.reject({ status: 400, msg: "Invalid article ID format" });
   }
 
   if (typeof inc_votes !== 'number') {
     return Promise.reject({ status: 400, msg: "Invalid vote increment format" });
   }
 
   const updateVotesQuery = `
     UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *;
   `;
 
   return db.query(updateVotesQuery, [inc_votes, article_id])
     .then(updateResult => {
       if (updateResult.rows.length === 0) {
         return Promise.reject({ status: 404, msg: 'Article not found' });
       }
       return updateResult.rows[0];
     });
 };


module.exports = {
  selectTopics,
  selectArticle,
  selectArticles,
  selectComments,
  insertComment,
  updateArticleVotes
};
