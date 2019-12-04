// @ts-check
const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => req.session.username !== 'root'

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [
  actions.echo(`adduser: Only root may add a user or group to the system.`)
]

module.exports = {
  sort: 1,
  test,
  exec
}
