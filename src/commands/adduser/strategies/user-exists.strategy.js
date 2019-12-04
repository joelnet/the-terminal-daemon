// @ts-check
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')
const { tables } = require('../../../stores/fs')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return tables.users.find({ username: { $eq: username } }).length > 0
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return [actions.echo(`adduser: The user \`${username}' already exists.`)]
}

module.exports = {
  sort: 20,
  test,
  exec
}
