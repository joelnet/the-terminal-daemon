const { getState } = require('./state')

const getTime = ({ req }) => getState(req).time || 0

/**
 * @param {Date} date
 * @param {Number} milliseconds
 */
const addSpan = (date, milliseconds) => new Date(date.getTime() + milliseconds)

module.exports = {
  getTime,
  addSpan
}
