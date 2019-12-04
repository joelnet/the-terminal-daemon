// @ts-check
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return !/^[a-z]{4,16}$/.test(username)
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => [
  actions.echo(`adduser: must contain only lowercase letters (4-16 characters)`)
]

module.exports = {
  sort: 11,
  test,
  exec
}
