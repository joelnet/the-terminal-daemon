const { isCommand } = require('../lib/command')
const actions = require('../actions')

const test = isCommand('whoami')

const exec = req => [actions.echo(req.session.env.USER)]

module.exports = {
  sort: 10,
  test,
  exec
}
