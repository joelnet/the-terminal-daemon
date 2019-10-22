const { stat } = require('./stat')

const isTypeFile = ({ type }) => type === 'f'

/**
 * Check existence of file
 * @param {object} options Full path
 * @param {string} options.dir Full path
 * @param {string} options.username username making request
 * @param {object} options.session username making request
 * @returns {boolean} True if file exists
 */
const fileExists = ({ dir, username, session }) =>
  stat({ path: dir, username, session }).getValue(() => false, isTypeFile)

module.exports = {
  fileExists
}
