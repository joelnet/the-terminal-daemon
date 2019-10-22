const { tables } = require('../stores/fs')

const hasMultipleServers = username => {
  const servers = tables.servers.find({ owner: { $eq: username } })
  return servers.length > 1
}

/**
 * get /home directory for user
 * @param {string} username User to search for
 * @param {string} host Address of host
 * @returns {Array<object>} Array of file handles
 */
const getHomeDirectory = (username, host) => {
  if (host !== 'home') {
    return [{ name: username, type: 'd', fs: [] }]
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
