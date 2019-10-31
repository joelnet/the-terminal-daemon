const { allPass } = require('mojiscript')
const path = require('path')
const { isCommand } = require('../../lib/command')
const { doesServerHavePackage } = require('../lib/doesServerHavePackage')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'cat'
const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)
const test = allPass([isCommand(name), doesServerHavePackage(name)])
const exec = execStrategy(strategies)

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
