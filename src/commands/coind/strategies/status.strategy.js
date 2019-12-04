// @ts-check
const { default: chalk } = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')

const name = 'coind'

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'status'
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const server = tables.servers.find({
    address: { $eq: req.session.env.HOST }
  })[0]

  const state = server.state || (server.state = {})

  const running = state.COIND != null && state.COIND.status === 'on'
  return [
    actions.echo(
      `${name}: ${running ? chalk.green('Running') : chalk.red('Stopped')}`
    )
  ]
}

module.exports = {
  sort: 10,
  test,
  exec
}
