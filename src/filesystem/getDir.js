const path = require('path')

const trimTrailingSlash = path =>
  path != '/' && path.substr(path.length - 1) === '/'
    ? path.substr(0, path.length - 1)
    : path

/**
 * Joins paths of pwd and dir
 * @param {string} pwd Current working directory
 * @param {string} dir Requested directory (relative or absolute)
 * @returns {string} Absolute path
 */
const getDir = ({ username, pwd, dir = '' }) =>
  trimTrailingSlash(
    dir.substr(0, 1) === '~' ? path.join(`/home/${username}`, dir.substr(1))
    : dir.substr(0, 1) === '/' ? dir
    : path.join(pwd, dir)
  ) // prettier-ignore

module.exports = {
  getDir
}
