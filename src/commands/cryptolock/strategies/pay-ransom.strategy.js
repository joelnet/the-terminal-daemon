const chalk = require('chalk')
const config = require('config')
const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')
const { setSessionToHomeServer } = require('../../exit.command')
const { add } = require('../../../lib/coinmath')

const bounty = config.get('packages.cryptolock.bounty')

const willPayRansom = ({ type }) => type === '2'

const test = req => {
  const [server] = tables.servers.find({ address: req.session.env.HOST })

  return willPayRansom(server)
}

const exec = req => {
  const { session, state } = req
  const { env } = session
  const [server] = tables.servers.find({ address: env.HOST })

  req.state.coins = add(req.state.coins, bounty)
  tables.state.update(state)

  tables.servers.remove(server)

  return [
    actions.echo(
      chalk`The owner has agreed to give a donation of {cyan.bold ${bounty} coin} for access to their server back.`
    ),
    ...setSessionToHomeServer(req)
  ]
}

module.exports = {
  sort: 10,
  test,
  exec
}
