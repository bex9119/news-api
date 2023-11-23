const express = require("express");
const { getEndpoints, invalidPath } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomeErrors,
} = require("./errors");
const { getArticles, getArticlesById, patchArticles } = require("./controllers/articles.controller");
const { getArticleCommentsById } = require("./controllers/comments.controller");

const app = express();

app.use(express.json())

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get('/api/articles', getArticles)

app.get("/api/articles/:article_id", getArticlesById);

app.patch('/api/articles/:article_id', patchArticles)

app.get('/api/articles/:article_id/comments', getArticleCommentsById)

app.all("*", invalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomeErrors);
app.use(handleServerErrors);

module.exports = app;
