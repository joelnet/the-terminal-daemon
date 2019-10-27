const actions = require('../../../actions')
const { name } = require('../adduser.command')

const test = () => true

const exec = req => {
  if (req.session.username !== 'root') {
    return [
      actions.echo(`${name}: Only root may add a user or group to the system.`)
    ]
  }
}

module.exports = {
  exec,
  sort: 100,
  test
}
