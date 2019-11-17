const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')
const tutorial = require('../../../tutorial')

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'balance'
}

const exec = req => {
  const { coins = '0' } = tables.state.get(req.session.username)

  tutorial.step6(req.session.username, coins)

  return [actions.echo(`Balance: ${Number(coins).toFixed(8)}`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
