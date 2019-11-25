const logger = require('./logger')

let isExiting = false
let onExitAction = () => {}

const onExit = func => {
  onExitAction = func
}

const safeExit = ({ code, warn, error }) => {
  if (isExiting === true) return
  isExiting = true
  if (warn) logger.warn(warn)
  if (error) logger.error(error)
  onExitAction()
  process.exitCode = code
}

process.on('uncaughtException', err => {
  safeExit({ code: 1, error: `Error: ${err.stack || err}` })
})

process.on('SIGINT', () => {
  safeExit({ code: 2, warn: 'CTRL-C detected. Exiting.' })
})

process.on(`SIGUSR1`, () => {
  safeExit({ code: 2, warn: 'SIGUSR1 detected. Exiting.' })
})

process.on(`SIGUSR2`, () => {
  safeExit({ code: 2, warn: 'SIGUSR2 detected. Exiting.' })
})

process.on(`SIGTERM`, () => {
  safeExit({ code: 2, warn: 'SIGTERM detected. Exiting.' })
})

module.exports = {
  onExit,
  safeExit
}
