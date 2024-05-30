const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");


const selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({ rows }) => rows);
 }

 const selectArticle = (article_id) =>{
    return db.query('SELECT * FROM articles WHERE article_id = $1', 
    [article_id])
    .then(result => {
        return result.rows[0]; 
    })
 }

 const selectArticles = ()=>{

let sqlQuery = `SELECT articles.article_id, articles.author, title, topic, 
articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
`
sqlQuery+=`ORDER BY created_at DESC`


 return db.query(sqlQuery).then((res) =>{ console.log(res)
    return res.rows})


 }

 module.exports = {selectTopics,selectArticle, selectArticles};


