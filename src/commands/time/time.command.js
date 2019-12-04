//@ts-check
const path = require('path')
const { isCommand } = require('../../lib/command')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'time'

const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = isCommand(name)

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = execStrategy(strategies)

module.exports = {
  sort: 10,
  test: test,
  exec: exec
}
