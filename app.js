const express = require("express");
const { getEndpoints, invalidPath } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomeErrors,
} = require("./errors");
const { getArticles, getArticlesById } = require("./controllers/articles.controller");
const { getArticleCommentsById, postComment } = require("./controllers/comments.controller");

const app = express();
app.use(express.json())

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get('/api/articles', getArticles)

app.get("/api/articles/:article_id", getArticlesById);

app.get('/api/articles/:article_id/comments', getArticleCommentsById)

app.post('/api/articles/:article_id/comments', postComment)

app.all("*", invalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomeErrors);
app.use(handleServerErrors);

module.exports = app;
