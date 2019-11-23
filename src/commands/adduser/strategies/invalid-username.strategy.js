const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

const test = req => {
  const [username] = getArgs(req.body.line).map(arg => arg.toLowerCase())
  return !/^[a-z]{4,16}$/.test(username)
}

const exec = () => [
  actions.echo(`adduser: must contain only lowercase letters (4-16 characters)`)
]

module.exports = {
  sort: 11,
  test,
  exec
}
