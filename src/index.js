const routes = require('@paciolan/express-easy-routes')
const config = require('config')
const express = require('express')
const logger = require('./logger')
const app = express()

logger.info('Starting')

const host = config.get('server.host')
const port = config.get('server.port')

process.on('uncaughtException', err => {
  logger.info(`Error: ${err}`)
  process.exit(1)
})

const main = async () => {
  await routes({ app, path: __dirname + '/middlewares/**/*.middleware.js' })
  await routes({ app, path: __dirname + '/controllers/**/*.controller.js' })

  app.listen(port, host, () => {
    logger.info(`Listening on http://${host}:${port}`)
  })
}

main().catch(err => {
  logger.error(err.stack || err)
})
