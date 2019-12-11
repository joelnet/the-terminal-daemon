//@ts-check
const { getCommand } = require('../../lib/command')
const actions = require('../../actions')

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = () => true

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = req => {
  const command = getCommand(req.body.line)
  return [actions.echo(`${command}: command not found`)]
}

module.exports = {
  sort: 100,
  test,
  exec
}
