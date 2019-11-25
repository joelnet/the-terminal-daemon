const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')

const name = 'coind'

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'stop'
}

const exec = req => {
  const server = tables.servers.find({
    address: { $eq: req.session.env.HOST }
  })[0]

  const state = server.state || (server.state = {})

  state.COIND = state.COIND || {}
  state.COIND.status = 'off'
  tables.servers.update(server)
  return [actions.echo(`${name}: Stopped`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
