const express = require('express')
const router = express.Router()
const { tables } = require('../stores/fs')

const hasSession = req => (req.session ? true : false)

router.use((req, res, next) => {
  if (hasSession(req)) {
    req.state = tables.state.get(req.session.username)
  }

  return next()
})

module.exports = {
  order: 200, // run after session
  router
}
