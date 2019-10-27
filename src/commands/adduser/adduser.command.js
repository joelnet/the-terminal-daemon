// TODO: use strategy pattern, like wallet
const path = require('path')
const { isCommand } = require('../../lib/command')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'adduser'
const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)
const test = isCommand(name)
const exec = execStrategy(strategies)

module.exports = {
  exec,
  name,
  sort: 10,
  test
}
