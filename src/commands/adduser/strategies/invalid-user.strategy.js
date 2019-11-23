const actions = require('../../../actions')

const test = req => req.session.username !== 'root'

const exec = () => [
  actions.echo(`adduser: Only root may add a user or group to the system.`)
]

module.exports = {
  sort: 1,
  test,
  exec
}
