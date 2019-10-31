const { getArgs } = require('../../../lib/command')
const { name } = require('../../wallet/wallet.command')
const actions = require('../../../actions')

const test = () => true

const exec = req => {
  const [command] = getArgs(req.body.line)
  return [actions.echo(`${name}: ${command}: Invalid command`)]
}

module.exports = {
  sort: 100,
  test,
  exec
}
