// @ts-check
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return username == null
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [actions.echo(`adduser: must include a username.`)]

module.exports = {
  sort: 10,
  test,
  exec
}
