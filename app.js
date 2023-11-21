const express = require('express')
const { getEndpoints, invalidPath } = require('./controllers/api.controller')
const { getTopics } = require('./controllers/topics.controller')
const { handleServerErrors, handlePSQLErrors } = require('./errors')
const { getArticles } = require('./controllers/articles-comments.controller')

const app = express()

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.all('*', invalidPath)

app.use(handleServerErrors)

module.exports = app