// @ts-check
const moment = require('moment')

const calculateSeconds = (future, past) => Math.trunc((future - past) / 1000)

const humanizeSeconds = seconds =>
  seconds > 60
    ? moment.duration(seconds, 'seconds').humanize()
    : `${seconds} seconds`

/**
 * Get's a human friendly time duration
 * @param {number} future unix time
 * @param {number} past unix time
 * @returns {string}
 */
const getHumanizedDuration = (future, past) => {
  return humanizeSeconds(calculateSeconds(future, past))
}

module.exports = {
  getHumanizedDuration
}
