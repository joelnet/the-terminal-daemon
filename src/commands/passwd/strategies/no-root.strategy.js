// @ts-check
const { default: chalk } = require('chalk')
const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => req.session.username === 'root'

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [actions.echo(chalk.red(`E: passwd: root is restricted`))]

module.exports = {
  sort: 1,
  test,
  exec
}
