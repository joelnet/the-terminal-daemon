//@ts-check
const { isCommand } = require('../../lib/command')
const { execStrategy } = require('../../lib/strategies')
const invalidUserStrategy = require('./strategies/invalid-user.strategy') // 1
const noUsernameStrategy = require('./strategies/no-username.strategy') // 10
const invalidUsernameStrategy = require('./strategies/invalid-username.strategy') // 11
const userExistsStrategy = require('./strategies/user-exists.strategy') // 20
const passwordMismatchStrategy = require('./strategies/password-mismatch.strategy') // 30
const passwordStrategy = require('./strategies/password.strategy') // 100
const retypePasswordStrategy = require('./strategies/retype-password.strategy') // 100
const createUserStrategy = require('./strategies/create-user.strategy') // 1000

const name = 'adduser'

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = isCommand(name)

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = execStrategy([
  invalidUserStrategy,
  noUsernameStrategy,
  invalidUsernameStrategy,
  userExistsStrategy,
  passwordMismatchStrategy,
  passwordStrategy,
  retypePasswordStrategy,
  createUserStrategy
])

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
