const express = require('express')
const router = express.Router()
const { tables } = require('../stores/fs')

const isLoggedIn = req => req.session && req.session.env

const noSessions = ['root']

router.use((req, res, next) => {
  if (isLoggedIn(req) && !noSessions.includes(req.session.username)) {
    req.state = tables.state.get(req.session.username)
  } else {
    req.state = {}
  }

  return next()
})

module.exports = {
  order: 200, // run after session
  router
}
