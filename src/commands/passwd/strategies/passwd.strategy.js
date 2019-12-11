const actions = require('../../../actions')
const { createHash } = require('../../../lib/password')
const { tables } = require('../../../stores/fs')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req =>
  req.body.password2 != null && req.body.password2 === req.body.state.password1

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const username = req.session.env.user
  const hash = createHash(req.body.password2)
  const [user] = tables.users.find({ user: username })

  if (user) {
    user.hash = hash
    tables.users.update(user)
    return [actions.echo('Password has been changed')]
  }
}

module.exports = {
  sort: 10,
  test,
  exec
}
