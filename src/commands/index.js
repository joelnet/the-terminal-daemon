const path = require('path')
const { setPrompt } = require('../prompt')
const { getStrategies, execStrategy } = require('../lib/strategies')
const { isScanRunning, completeTraining } = require('./train.command')

const strategies = getStrategies(path.join(__dirname, '**/*.command.js'))

const exec = async (req, res) => {
  const response = await execStrategy(strategies)(req, res)
  const withPrompt = response.concat(setPrompt(req, res))

  // TODO: refactor training.command.js to make this part better
  const extraCommands =
    req.state.training_currently != null && !isScanRunning(req.state)
      ? completeTraining(req)
      : []

  return res.json(extraCommands.concat(withPrompt))
}

module.exports = {
  exec
}
