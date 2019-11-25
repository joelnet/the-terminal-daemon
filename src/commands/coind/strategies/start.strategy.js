const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')
const tutorial = require('../../../tutorial')

const name = 'coind'

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'start'
}

const exec = req => {
  const { username } = req.session

  const server = tables.servers.find({
    address: { $eq: req.session.env.HOST }
  })[0]

  const state = server.state || (server.state = {})

  state.COIND = state.COIND || {}
  state.COIND.status = 'on'
  tables.servers.update(server)

  if (server.address !== 'home') {
    tutorial.step5(username)
  }

  return [actions.echo(`${name}: Started`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
