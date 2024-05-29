const db = require("../db/connection");


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


 module.exports = {selectTopics,selectArticle};


