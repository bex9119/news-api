const db = require("../db/connection");

exports.selectCommentsForArticle = (article_id) => {
    return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      console.log(rows)
      return rows;
    });
}