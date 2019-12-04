// @ts-check
const { default: chalk } = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')

const name = 'coind'

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [command] = getArgs(req.body.line)
  return command == null || command === '--help'
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [
  actions.echo(chalk`Usage: ${name} command

  {underline command}  {underline description}
  status   shows the running status
  start    starts the coin daemon
  stop     stops the coin daemon`)
]

module.exports = {
  sort: 10,
  test,
  exec
}
