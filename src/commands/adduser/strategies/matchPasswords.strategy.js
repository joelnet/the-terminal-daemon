const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')
const { createHash } = require('../../../lib/password')
const tutorial = require('../../tutorial')

const test = req => req.body.password2

const exec = req => {
  const [username] = getArgs(req.body.line)

  if (req.body.password2 !== req.body.state.password1) {
    return [actions.echo('Sorry, passwords do not match.')]
  }

  const hash = createHash(req.body.password2)

  tables.users.insert({ username, hash })
  tutorial.step1(username)

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
  exec,
  sort: 10,
  test
}
