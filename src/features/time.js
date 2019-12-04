const { getState } = require('./state')
const { getTraining } = require('./training')

const ONE_SECOND = 1000
const ONE_MINUTE = 60 * ONE_SECOND

const minutesPerTraining = 120

const getTime = ({ req }) => getState(req).time || 0

/**
 * @param {Date} date
 * @param {Number} milliseconds
 */
const addSpan = (date, milliseconds) => new Date(date.getTime() + milliseconds)

const getTrainingCount = state =>
  getTraining(state).filter(training => training.startsWith('time-')).length

const calculateMinutesPerDay = ({ state }) =>
  getTrainingCount(state) * minutesPerTraining

const getNextTimeReleaseInterval = ({ state }) =>
  Math.ceil(1440 / calculateMinutesPerDay({ state }))

const getNextTimeRelease = ({ state }) => {
  if (state.next_time_at != null) {
    return new Date(state.next_time_at)
  }

  const max = calculateMinutesPerDay({ state }) - state.time

  return max <= 0
    ? null
    : addSpan(new Date(), getNextTimeReleaseInterval({ state }) * ONE_MINUTE)
}

const calculateTimeIncrease = ({ state }) => {
  if (!state.next_time_at || Date.parse(state.next_time_at) > Date.now()) {
    return 0
  }

  const minutesPassed = Math.floor(
    (Date.now() - Date.parse(state.next_time_at)) / ONE_MINUTE
  )
  const interval = getNextTimeReleaseInterval({ state })
  return 1 + Math.floor(minutesPassed / interval)
}

const shouldCollectTime = ({ state }) =>
  state.next_time_at && Date.parse(state.next_time_at) <= Date.now()

const collectTime = ({ state }) => {
  const max = calculateMinutesPerDay({ state })
  state.time = Math.min(state.time + calculateTimeIncrease({ state }), max)
  delete state.next_time_at
  state.next_time_at = getNextTimeRelease({ state })
}

module.exports = {
  getTime,
  addSpan,
  calculateMinutesPerDay,
  getNextTimeRelease,
  calculateTimeIncrease,
  shouldCollectTime,
  collectTime
}
