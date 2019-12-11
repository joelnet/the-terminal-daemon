//@ts-check
const { isCommand } = require('../../lib/command')
const actions = require('../../actions')

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = isCommand('clear')

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = () => [actions.echo('\u001b[2J\u001b[0;0H', { crlf: false })]

module.exports = {
  sort: 10,
  test,
  exec
}
