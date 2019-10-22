const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')
const tutorial = require('../../../tutorial')

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'balance'
}

const exec = req => {
  const user = tables.users.find({ username: req.session.username })[0]
  const { coins = '0' } = user

  tutorial.step4(req.session.username, coins)

  return [actions.echo(`Balance: ${Number(coins).toFixed(8)}`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
