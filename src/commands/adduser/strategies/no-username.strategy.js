const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

const test = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return username == null
}

const exec = () => [actions.echo(`adduser: must include a username.`)]

module.exports = {
  sort: 10,
  test,
  exec
}
