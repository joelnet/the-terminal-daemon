const { stat } = require('./stat')

/**
 * Check existence of file or directory
 * @param {string} dir Full path
 * @param {string} username username making request
 * @returns {boolean} True if file or directory exists
 */
const exists = (path, username) =>
  stat(path, username).getValue(() => false, () => true)

module.exports = {
  exists
}
