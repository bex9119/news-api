const { selectCommentsForArticle } = require("../models/comments.model");

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsForArticle(article_id)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch(next);
  }