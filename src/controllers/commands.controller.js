const express = require('express')
const router = express.Router()

router.get('/commands', (_, res) => {
  res.json({
    whoami: {
      help: 'whoami'
    },
    adduser: {
      help: 'adds a user'
    },
    login: {
      help: 'user login'
    },
    ping: {
      help: 'pings the server'
    }
  })
})

module.exports = {
  order: 100,
  router
}
