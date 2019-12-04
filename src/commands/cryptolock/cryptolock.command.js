//@ts-check
const { allPass } = require('mojiscript')
const path = require('path')
const { doesServerHavePackage } = require('../lib/doesServerHavePackage')
const { isCommand } = require('../../lib/command')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'cryptolock'

const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)

/**
 * @type { import('../../types/strategy').StrategyTest }
 */
const test = allPass([isCommand(name), doesServerHavePackage(name)])

/**
 * @type { import('../../types/strategy').StrategyExec }
 */
const exec = execStrategy(strategies)

module.exports = {
  sort: 10,
  test: test,
  exec: exec
}
