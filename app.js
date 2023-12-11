const express = require("express");
const cors = require('cors')

const {
  handleServerErrors,
  handlePSQLErrors,
  handleCustomeErrors,
} = require("./errors");

const apiRouter = require("./routes/api-router");
const { invalidPath } = require("./controllers/api.controller");

const app = express();
app.use(cors())
app.use(express.json())

app.use('/', apiRouter)

app.use('/api', apiRouter)

app.all("*", invalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomeErrors);
app.use(handleServerErrors);

module.exports = app;
