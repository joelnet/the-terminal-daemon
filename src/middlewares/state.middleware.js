const express = require('express')
const router = express.Router()
const { tables } = require('../stores/fs')

const isLoggedIn = req => req.session && req.session.env

const noSessions = ['root']

const controller = (req, res, next) => {
  if (isLoggedIn(req) && !noSessions.includes(req.session.username)) {
    req.state = tables.state.get(req.session.username)
  } else {
    req.state = {}
  }

  return next()
}

router.use(controller)

module.exports = {
  order: 100, // run after session
  router,
  controller
}
