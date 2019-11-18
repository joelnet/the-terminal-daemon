const { getDir } = require('../../../filesystem/getDir')
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')
const { tables } = require('../../../stores/fs')

const test = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session

  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })

  return path === `/home/${username}/servers`
}

const exec = req => {
  const { username } = req.session

  const servers = tables.servers.find({
    owner: { $eq: username },
    address: { $ne: 'home' }
  })

  return [actions.echo(servers.map(server => server.address).join('\n'))]
}

module.exports = {
  sort: 10,
  test,
  exec
}
