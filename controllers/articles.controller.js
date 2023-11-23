const { selectArticleById, selectArticles, patchByArticleId } = require("../models/articles.model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic }  = req.query
  selectArticles(topic)
  .then((articles) => {
    res.status(200).send({articles})
  })
  .catch(next)
}

exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const patchArticle = req.body
    patchByArticleId(article_id, patchArticle)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
