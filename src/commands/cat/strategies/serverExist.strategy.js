const { getDir } = require('../../../filesystem/getDir')
const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')

const test = req => {
    const [command] = getArgs(req.body.line)
    return command === 'serverExist'
}

const exec = req => {
  const { username, env: { PWD: pwd }} = req.session

  const path = getDir({ username, pwd, dir: arg })

  if (path === `/home/${username}/servers`) {
    const servers = tables.servers.find({
      owner: { $eq: username },
      address: { $ne: 'home' }
    })
    return [actions.echo(servers.map(server => server.address).join('\n'))]
  }
}

module.exports = {
    sort: 10,
    test,
    exec
  }