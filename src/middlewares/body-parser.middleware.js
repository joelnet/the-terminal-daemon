const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json()) // json parser

module.exports = {
  order: 10,
  router
}
