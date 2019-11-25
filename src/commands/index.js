const path = require('path')
const { setPrompt } = require('../prompt')
const { getStrategies, execStrategy } = require('../lib/strategies')
const { isScanRunning, completeTraining } = require('./train.command')
const nscan = require('./nscan/discover-server')

const strategies = getStrategies(path.join(__dirname, '**/*.command.js'))

/**
 * Is execStrategy attempting to PROMPT the user?
 */
const isPromptMode = response => response.some(({ type }) => type === 'PROMPT')

const exec = async (req, res) => {
  const response = await execStrategy(strategies)(req, res)

  const trainingCommands =
    req.state.training_currently != null && !isScanRunning(req.state)
      ? completeTraining(req)
      : []

  const nscanCommands =
    req.state.nscan_end_at && nscan.test(req) ? nscan.exec(req) : []

  const withPrompt = isPromptMode(response)
    ? response
    : response.concat(setPrompt(req, res))

  const commands = []
    .concat(trainingCommands)
    .concat(nscanCommands)
    .concat(withPrompt)

  return res.json(commands)
}

module.exports = {
  exec
}
