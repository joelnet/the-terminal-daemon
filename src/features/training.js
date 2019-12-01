const config = require('config')
const { fileExists } = require('../filesystem/fileExists')

const allTraining = config.get('training')

const getAllTraining = () => allTraining

const meetsRequirement = ({
  session,
  requirement,
  state: { username, training = [] }
}) =>
  (requirement.startsWith('training:') &&
    training.some(t => t === requirement.substr(9))) ||
  (requirement.startsWith('command:') &&
    fileExists({ dir: '/bin/nscan', username, session }))

const getAvailableTraining = ({
  session,
  state: { username, training = [] }
}) => {
  return Object.keys(allTraining)
    .map(key => [key, allTraining[key]])
    .filter(([key, value]) => {
      // already have trained
      if (training.some(k => k === key)) return false

      // meets requirement
      if (
        (value.require || []).every(requirement =>
          meetsRequirement({
            session,
            requirement,
            state: { username, training }
          })
        )
      ) {
        return true
      }

      return false
    })
}

module.exports = {
  getAllTraining,
  meetsRequirement,
  getAvailableTraining
}
