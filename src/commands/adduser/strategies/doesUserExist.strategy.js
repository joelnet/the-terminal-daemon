const actions = require('../../../actions')
const { name } = require('../adduser.command')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')

const test = () => true

const exec = req => {
  const [username] = getArgs(req.body.line)

  if (tables.users.find({ username: { $eq: username } })[0]) {
    return [actions.echo(`${name}: The user \`${username}' already exists.`)]
  }
}

module.exports = {
  exec,
  sort: 80,
  test
}
