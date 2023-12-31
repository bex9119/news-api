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

exports.removeComment = (comment_id) => {
  return db
  .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
  .then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  })
}

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
  .query(`SELECT votes FROM comments WHERE comment_id = $1`, [comment_id])
  .then(({rows}) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    const updatedVote = rows[0].votes += inc_votes
    return db
    .query(`UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`, [updatedVote, comment_id])
  })
  .then(({ rows }) => {
    return rows[0]
  })
}