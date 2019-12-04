//@ts-check
const { isCommand } = require('../lib/command')
const actions = require('../actions')

/**
 * @type { import('../types/strategy').StrategyTest }
 */
const test = isCommand('whoami')

/**
 * @type { import('../types/strategy').StrategyExec }
 */
const exec = req => [actions.echo(req.session.env.USER)]

module.exports = {
  sort: 10,
  test,
  exec
}
