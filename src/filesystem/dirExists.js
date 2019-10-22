const { stat } = require('./stat')

const isTypeDirectory = ({ type }) => type === 'd'

/**
 * Check existence of directory
 * @param {object} options
 * @param {string} options.dir Full path
 * @param {string} options.username username making request
 * @param {object} options.session username making request
 * @returns {boolean} True if directory exists
 */
const dirExists = ({ dir, username, session }) =>
  stat({ path: dir, username, session }).getValue(() => false, isTypeDirectory)

module.exports = {
  dirExists
}
