const db = require("../db/connection");

exports.selectCommentsForArticle = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
    .then(({ rows }) => {
      return rows;
    });
}

exports.insertComment = (article_id, {username, body}) => {
    return db
    .query(`INSERT INTO comments (article_id, author, body)
            VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body])
    .then(({rows}) => {

          return rows[0]
    })
}
