const chalk = require('chalk')
const config = require('config')
const { getArgs } = require('../../../lib/command')
const { getDir } = require('../../../filesystem/getDir')
const actions = require('../../../actions')
const { tables } = require('../../../stores/fs')
const allServerTypes = config.get('serverTypes')
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
  return [
    actions.echo(
      servers
        .sort((serverA, serverB) => serverA.type - serverB.type)
        .map(server => {
          const { address } = server
          const type = allServerTypes[server.type]
          const packages = Array.isArray(server.packages)
            ? JSON.stringify(server.packages)
            : ''
          return chalk`${address}  {cyan ${type}} {yellow ${packages}}`
        })
        .join('\n')
    )
  ]
}
module.exports = {
  sort: 100,
  test,
  exec
}
