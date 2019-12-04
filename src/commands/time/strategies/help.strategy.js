// @ts-check
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [command] = getArgs(req.body.line)
  return command == null || command == '--help'
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () =>
  `usage: time <minutes>
  skip forward in time by <minutes>

  example:
    time 60 # skip forward 60 minutes`
    .split('\n')
    .map(line => actions.echo(line || ' '))

module.exports = {
  sort: 10,
  test,
  exec
}
