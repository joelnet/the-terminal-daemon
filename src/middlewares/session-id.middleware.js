const chalk = require('chalk')
const config = require('config')
const express = require('express')
const router = express.Router()
const { sessions } = require('../stores/memory')
const actions = require('../actions')

const isPost = req => req.method === 'POST'
const hasSessionId = req =>
  req.body.id != null && sessions.find({ id: { $eq: req.body.id } }).length > 0

router.use((req, res, next) => {
  if (isPost(req) && !hasSessionId(req)) {
    const message = config.get('copy.invalid-session')
    res.json([actions.echo(chalk.red(message)), actions.exit()])
    next(message)
  }

  return next()
})

module.exports = {
  order: 20,
  router
}
