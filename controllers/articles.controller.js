const { selectArticleById, selectArticles, patchByArticleId } = require("../models/articles.model");
const { selectTopicSlugs } = require("../models/topics.models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order }  = req.query
  const selectPromises = [selectArticles(topic, sort_by, order)]
  if(topic) {
    selectPromises.push(selectTopicSlugs(topic))
  }
  
  Promise.all(selectPromises)
  .then((reslovedPromises) => {
    const articles = reslovedPromises[0]
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
