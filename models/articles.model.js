const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT articles.* , COUNT(comments.comment_id):: int AS comment_count FROM comments
    RIGHT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};
exports.selectArticles = (topic) => {
    // const validTopics = ['cats', 'mitch', 'test', 'coding', 'football', 'cooking']

  //   if(topic && !validTopics.includes(topic)) {
  //     return Promise.reject({status: 400, msg: 'Bad Request'})
  // }
    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id):: int AS comment_count FROM comments
    RIGHT JOIN articles ON articles.article_id = comments.article_id`
    
    if(topic) {
      queryString += ` WHERE articles.topic = '${topic}'
      GROUP BY articles.article_id ORDER BY created_at DESC`

  } else {
      queryString += ` GROUP BY articles.article_id ORDER BY created_at DESC`}
    return db
    .query(queryString)
    .then(({rows}) => {
        return rows
    })
}

exports.patchByArticleId = (article_id, patchArticle) => {
  return db
    .query(`SELECT votes FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      const updatedVote = rows[0].votes += patchArticle.inc_votes
      return db
      .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`, [updatedVote, article_id])
    })
    .then(({rows}) => {
      return rows[0]
    })
};
