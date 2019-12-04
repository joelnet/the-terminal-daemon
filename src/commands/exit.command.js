//@ts-check
const { isCommand } = require('../lib/command')
const actions = require('../actions')

/**
 * @type { import('../types/strategy').StrategyTest }
 */
const test = isCommand('exit')

const isHomeServer = ({ session }) => session.username === session.env.USER

const setSessionToHomeServer = ({ session }) => {
  Object.assign(session.env, {
    HOST: 'home',
    USER: session.username,
    PWD: `/home/${session.username}`
  })

  return [actions.historyStackPop(), actions.echo('Connection closed.')]
}

const exitApp = () => [actions.exit()]

/**
 * @type { import('../types/strategy').StrategyExec }
 */
const exec = req =>
  isHomeServer(req) ? exitApp() : setSessionToHomeServer(req)

module.exports = {
  sort: 10,
  test,
  exec,
  setSessionToHomeServer
}
