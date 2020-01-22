// const { allPass } = require('mojiscript')
const { isCommand } = require('../../lib/command')
const path = require('path')
// const { doesServerHavePackage } = require('../lib/doesServerHavePackage')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'cat'

const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)
const test = isCommand(name)
const exec = execStrategy(strategies)

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
