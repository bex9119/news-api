const express = require('express')
const { controllerSetUp, invalidPath } = require('./controllers/api.controller')
const { getTopics } = require('./controllers/topics.controller')
const { handleServerErrors, handlePSQLErrors } = require('./errors')

const app = express()

app.use(express.json())

app.get('/api/', controllerSetUp)

app.get('/api/topics', getTopics)

app.all('*', invalidPath)

app.use(handleServerErrors)

module.exports = app