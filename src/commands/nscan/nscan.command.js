//@ts-check
const { allPass } = require('mojiscript')
const { isCommand } = require('../../lib/command')
const { doesServerHavePackage } = require('../lib/doesServerHavePackage')
const { execStrategy, getStrategies } = require('../../lib/strategies')
const path = require('path')

const name = 'nscan'

const strategies = getStrategies(path.join(__dirname, '**/*.strategy.js'))

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
  test,
  exec,
  name
}
