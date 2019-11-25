const routes = require('@paciolan/express-easy-routes')
const config = require('config')
const express = require('express')
const logger = require('./logger')
const app = express()

logger.info('Starting')

const host = config.get('server.host')
const port = config.get('server.port')

const safeExit = code => {
  setTimeout(() => process.exit(1), 1000)
  process.exitCode = code
}

process.on('uncaughtException', err => {
  logger.error(`Error: ${err.stack || err}`)
  safeExit(1)
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
  safeExit(1)
})
