const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')
const { setSessionToHomeServer } = require('../../exit.command')

const test = () => true

const exec = req => {
  const { session } = req
  const { env } = session
  const [server] = tables.servers.find({ address: env.HOST })

  tables.servers.remove(server)

  return [
    actions.echo(
      'The owner did not pay the bounty. The server is permanently unavailable.'
    ),
    ...setSessionToHomeServer(req)
  ]
}

module.exports = {
  sort: 100,
  test,
  exec
}
