const express = require("express");
const { getEndpoints, invalidPath } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomeErrors,
} = require("./errors");
const { getArticles } = require("./controllers/articles.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("*", invalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomeErrors);
app.use(handleServerErrors);

module.exports = app;
