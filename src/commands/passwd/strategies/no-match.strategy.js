const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req =>
  req.body.password2 != null && req.body.password2 !== req.body.state.password1

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [actions.echo('Sorry, passwords do not match.')]

module.exports = {
  sort: 10,
  test,
  exec
}
