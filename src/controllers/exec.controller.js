const express = require('express')
const router = express.Router()
const { exec } = require('../commands')

router.post('/exec', exec)

module.exports = {
  order: 100,
  router
}
