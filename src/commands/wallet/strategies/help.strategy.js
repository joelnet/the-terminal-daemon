const chalk = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { name } = require('../wallet.command')

const test = req => {
  const [command] = getArgs(req.body.line)
  return command == null || command === '--help'
}
const exec = () => [
  actions.echo(chalk`Usage: ${name} command

{underline command}  {underline description}
balance  show current wallet balance
miners   show miners statuses
collect  collect coins from miners`)
]

module.exports = {
  sort: 10,
  test,
  exec
}
