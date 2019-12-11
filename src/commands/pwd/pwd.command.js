//@ts-check
const { isCommand } = require('../../lib/command')
const actions = require('../../actions')

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = isCommand('pwd')

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = req => {
  const {
    env: { PWD }
  } = req.session
  return [actions.echo(PWD)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
