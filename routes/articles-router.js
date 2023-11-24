const { getArticles, getArticlesById, patchArticles } = require('../controllers/articles.controller');
const { getArticleCommentsById, postComment } = require('../controllers/comments.controller');

const articlesRouter = require('express').Router()

articlesRouter.get('/', getArticles)

articlesRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticles);

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)
    .post(postComment)

module.exports = articlesRouter