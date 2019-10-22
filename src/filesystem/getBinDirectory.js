const { files } = require('./files')
const { tables } = require('../stores/fs')

/**
 * get /bin directory for user
 * @param {string} username User to search for
 * @param {string} host Address of host
 * @returns {Array<object>} Array of file handles
 */
const getBinDirectory = (username, host) => {
  const server = tables.servers.find({
    owner: { $eq: username },
    address: { $eq: host }
  })[0]

  const pkgs = (server && server.packages) || []
  const fs = pkgs.map(pkg => ({
    name: pkg,
    type: 'f'
  }))

  return [...files.find(({ name }) => name === 'bin').fs, ...fs].sort((a, b) =>
    a.name < b.name ? -1 : 1
  )
}

module.exports = {
  getBinDirectory
}
