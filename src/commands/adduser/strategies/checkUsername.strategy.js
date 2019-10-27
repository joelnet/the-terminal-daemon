const actions = require('../../../actions')
const { name } = require('../adduser.command')
const { getArgs } = require('../../lib/command')

const test = () => true

const exec = req => {
  const [username] = getArgs(req.body.line)

  if (username == null) {
    return [actions.echo(`${name}: must include a username.`)]
  }
}

module.exports = {
  exec,
  sort: 90,
  test
}
