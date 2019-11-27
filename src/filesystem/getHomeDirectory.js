const generate = require('project-name-generator')
const { tables } = require('../stores/fs')

const hasMultipleServers = username => {
  const servers = tables.servers.find({ owner: { $eq: username } })
  return servers.length > 1
}

const isHomePc = ({ type } = {}) => type === '2'

const ensureConfigUserDirs = server => {
  const doConfig = isHomePc(server) && (!server.state || !server.state.users)

  if (doConfig) {
    server.state = server.state || {}
    server.state.users = [generate().dashed]
    tables.servers.update(server)
  }
}

/**
 * get /home directory for user
 * @param {string} username User to search for
 * @param {string} host Address of host
 * @returns {Array<object>} Array of file handles
 */
const getHomeDirectory = (username, host) => {
  if (host !== 'home') {
    const [server] = tables.servers.find({
      address: { $eq: host }
    })

    ensureConfigUserDirs(server)

    return [
      { name: username, type: 'd', fs: [] },
      ...(isHomePc(server)
        ? server.state.users.map(name => ({
            name,
            type: 'd',
            fs: [
              { name: 'Desktop', type: 'd', fs: [] },
              { name: 'Documents', type: 'd', fs: [] },
              { name: 'Pictures', type: 'd', fs: [] }
            ]
          }))
        : [])
    ]
  }

  const fs =
    username !== 'root' && hasMultipleServers(username)
      ? [{ name: 'servers', type: 'f' }]
      : []

  return [{ name: username, type: 'd', fs }]
}

module.exports = {
  getHomeDirectory
}
