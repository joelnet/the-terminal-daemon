const express = require('express')
const router = express.Router()
const { sessions } = require('../stores/memory')

const hasSessionId = req =>
  req.body.id != null && sessions.find({ id: { $eq: req.body.id } }).length > 0

router.use((req, res, next) => {
  if (hasSessionId(req)) {
    req.session = sessions.find({ id: { $eq: req.body.id } })[0]
  }

  return next()
})

module.exports = {
  order: 100,
  router
}
