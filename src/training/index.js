const config = require('config')

const allTraining = config.get('training')

const findLessonByReward = reward =>
  Object.keys(allTraining)
    .map(key => [key, allTraining[key]])
    .filter(([, { rewards }]) => rewards && rewards.some(r => r === reward))[0]

const getTrained = ({ training = [] }) =>
  training.map(key => [key, allTraining[key]])

const isTrained = lesson => user =>
  getTrained(user).filter(([key]) => key === lesson).length > 0

module.exports = {
  findLessonByReward,
  getTrained,
  isTrained
}
