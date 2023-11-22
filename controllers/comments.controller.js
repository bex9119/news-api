const { selectArticleById } = require("../models/articles.model");
const { selectCommentsForArticle } = require("../models/comments.model");

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    const selectPromises = [selectCommentsForArticle(article_id), selectArticleById(article_id)]
      Promise.all(selectPromises)
      .then((reslovedPromises) => {
        const comments = reslovedPromises[0]
        res.status(200).send({ comments });
      })
      .catch(next);
  }