// @ts-check
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')

const name = 'coind'

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = () => true

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const [command] = getArgs(req.body.line)
  return [actions.echo(`${name}: ${command}: Invalid command`)]
}

module.exports = {
  sort: 100,
  test,
  exec
}
