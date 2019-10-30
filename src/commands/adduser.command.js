// TODO: use strategy pattern, like wallet
const { isCommand, getArgs } = require('../lib/command')
const { tables } = require('../stores/fs')
const { createHash } = require('../lib/password')
const actions = require('../actions')
const tutorial = require('../tutorial')
const logger = require('../logger')

const name = 'adduser'

const test = isCommand(name)

const exec = req => {
  const [username] = getArgs(req.body.line)

  if (req.session.username !== 'root') {
    return [
      actions.echo(`${name}: Only root may add a user or group to the system.`)
    ]
  }

  if (username == null) {
    return [actions.echo(`${name}: must include a username.`)]
  }

  if (tables.users.find({ username: { $eq: username } })[0]) {
    return [actions.echo(`${name}: The user \`${username}' already exists.`)]
  }

  if (req.body.password2) {
    if (req.body.password2 !== req.body.state.password1) {
      return [actions.echo('Sorry, passwords do not match.')]
    }

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
