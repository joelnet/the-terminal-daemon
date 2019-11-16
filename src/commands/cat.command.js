// TODO: use strategy pattern, like wallet
const config = require('config')
const { isCommand, getArgs } = require('../lib/command')
const actions = require('../actions')
const { getDir } = require('../filesystem/getDir')
const { tables } = require('../stores/fs')
const { dirExists } = require('../filesystem')
const { fileExists } = require('../filesystem')

const test = isCommand('cat')

const allServerTypes = config.get('serverTypes')

const exec = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session

  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })

  if (dirExists({ dir: path, username, session: req.session })) {
    return [actions.echo(`cat: ${arg}: Is directory`)]
  }

  if (!fileExists({ dir: path, username, session: req.session })) {
    return [actions.echo(`cat: ${arg}: No such file or directory`)]
  }

  if (path === `/home/${username}/servers`) {
    const servers = tables.servers.find({
      owner: { $eq: username },
      address: { $ne: 'home' }
    })
    return [actions.echo(servers
      .sort((serverA, serverB) => serverA.type - serverB.type)
      .map(server => `${server.address} ${allServerTypes[server.type]}`)
      .join('\n')
    )]
  }

  return [actions.echo(`cat: ${arg}: File cannot be output`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
