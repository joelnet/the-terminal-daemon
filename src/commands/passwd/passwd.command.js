//@ts-check
const { isCommand } = require('../../lib/command')
const { createHash } = require('../../lib/password')
const actions = require('../../actions')
const { tables } = require('../../stores/fs')

const name = 'passwd'

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = isCommand(name)

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = req => {
  const username = req.session.env.user

  if (req.body.password2) {
    if (req.body.password2 !== req.body.state.password1) {
      return [actions.echo('Sorry, passwords do not match.')]
    } else {
      const hash = createHash(req.body.password2)
      const user = tables.users.find({ user: username })[0]
      if (user) {
        user.hash = hash
        tables.users.update(user)
        return [actions.echo('Password has been changed')]
      }
    }
  }

  if (req.body.password1) {
    return [
      actions.prompt({
        prompt: 'Retype new password: ',
        type: 'password',
        action: 'exec',
        line: req.body.line,
        key: 'password2',
        history: false,
        state: {
          password1: req.body.password1
        }
      })
    ]
  }

  return [
    actions.prompt({
      prompt: 'New password: ',
      type: 'password',
      action: 'exec',
      line: req.body.line,
      key: 'password1',
      history: false
    })
  ]
}

module.exports = {
  sort: 10,
  test,
  exec
}
