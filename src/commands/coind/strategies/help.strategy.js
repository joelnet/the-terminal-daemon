const chalk = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')

const name = 'coind'

const test = req => {
  const [command] = getArgs(req.body.line)
  return command == null || command === '--help'
}
const exec = () => [
  actions.echo(chalk`Usage: ${name} command

  {underline command}  {underline description}
  status   shows the running status
  start    starts the coin daemon
  stop     stops the coin daemon`)
]

module.exports = {
  sort: 10,
  test,
  exec
}
