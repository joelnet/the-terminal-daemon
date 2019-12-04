//@ts-check
const { anyPass } = require('mojiscript')
const { isCommand } = require('../lib/command')

/**
 * @type { import('../types/strategy').StrategyTest }
 */
const test = anyPass([isCommand(''), isCommand('noop')])

/**
 * @type { import('../types/strategy').StrategyExec }
 */
const exec = () => []

module.exports = {
  sort: 10,
  test,
  exec
}
