// @ts-check
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')
const { tables } = require('../../../stores/fs')
const tutorial = require('../../../tutorial')
const { createHash } = require('../../../lib/password')
const logger = require('../../../logger')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => req.body.password1 === req.body.state.password2

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  const hash = createHash(req.body.password2)

  tables.users.insert({ username, hash })
  tutorial.step1(username)

  logger.info(`Added user \`${username}\``)

  return [
    actions.echo(
      `Adding user \`${username}' ...\n` +
        `Adding new group \`${username}' ...\n` +
        `Adding new user \`${username}' with group \`${username}' ...\n` +
        `Creating home directory \`/home/${username}' ...\n`
    )
  ]
}

module.exports = {
  sort: 1000,
  test,
  exec
}
