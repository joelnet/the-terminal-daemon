//@ts-check
const { default: chalk } = require('chalk')
const path = require('path')
const actions = require('../actions')
const { setPrompt } = require('../prompt')
const { getStrategies, execStrategy } = require('../lib/strategies')
const { isScanRunning, completeTraining } = require('./train/train.command')
const nscan = require('./nscan/discover-server')
const {
  getNextTimeRelease,
  shouldCollectTime,
  collectTime
} = require('../features/time')
const { tables } = require('../stores/fs')
const logger = require('../logger')

const strategies = getStrategies(path.join(__dirname, '**/*.command.js'))

/**
 * Is execStrategy attempting to PROMPT the user?
 */
const isPromptMode = response => response.some(({ type }) => type === 'PROMPT')

/**
 * @type { import('../types/strategy').StrategyExec }
 */
const exec = async (req, res) => {
  let response
  try {
    response = await execStrategy(strategies)(req, res)
  } catch (err) {
    logger.error(err)
    return res.json(actions.echo(chalk.red(`Unhandled Error: ${err.stack}`)))
  }

  if (!req.state.next_time_at) {
    req.state.next_time_at = getNextTimeRelease(req)
  }

  if (shouldCollectTime(req)) {
    collectTime(req)
  }

  if (req.state.$loki) {
    tables.state.update(req.state)
  }

  const trainingCommands =
    req.state.training_currently != null && !isScanRunning(req.state)
      ? completeTraining(req)
      : []

  const nscanCommands =
    req.state.nscan_end_at && nscan.test(req) ? nscan.exec(req) : []

  const withPrompt = isPromptMode(response)
    ? response
    : response.concat(setPrompt(req))

  const commands = []
    .concat(trainingCommands)
    .concat(nscanCommands)
    .concat(withPrompt)

  return res.json(commands)
}

module.exports = {
  exec
}
