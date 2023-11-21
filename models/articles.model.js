const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by, order) => {
    const validSortBy = ['created_at']
    const validOrder = ['DESC', 'ASC']
    if(sort_by && !validSortBy.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    if(order && !validOrder.includes(order)) {
        return Promise.reject({status: 400, msg: 'Bad Request'})  
    }

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id):: int AS comment_count FROM comments
    RIGHT JOIN articles ON articles.article_id = comments.article_id
    GROUP BY articles.article_id `

    if(sort_by) {
        queryString += `ORDER BY ${sort_by} `
    }

    if(order) {
        queryString += `${order}`
    }
    return db
    .query(queryString)
    .then(({rows}) => {
        return rows
    })
}
