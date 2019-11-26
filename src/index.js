const routes = require('@paciolan/express-easy-routes')
const config = require('config')
const express = require('express')
const logger = require('./logger')
const app = express()
const { db } = require('./stores/fs')
const { safeExit, onExit } = require('./safeExit')

logger.info('Starting')

const host = config.get('server.host')
const port = config.get('server.port')

const main = async () => {
  await routes({ app, path: __dirname + '/middlewares/**/*.middleware.js' })
  await routes({ app, path: __dirname + '/controllers/**/*.controller.js' })

  const server = app.listen(port, host, err => {
    if (err) {
      logger.error(err)
      return safeExit(1)
    }

    logger.info(`Listening on http://${host}:${port}`)
  })

  onExit(() => {
    logger.warn('Application exiting.')
    db.close()
    server.close()
  })
}

main().catch(err => {
  logger.error(err.stack || err)
  safeExit(1)
})
