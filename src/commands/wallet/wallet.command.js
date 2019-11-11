const { allPass } = require('mojiscript')
const path = require('path')
const { isCommand } = require('../../lib/command')
const { doesServerHavePackage } = require('../lib/doesServerHavePackage')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'wallet'

// This export need to be done before we import the strategies or the name variable won't be found when trying to access in a strategy
module.exports.name = name

const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)
const test = allPass([isCommand(name), doesServerHavePackage(name)])
const exec = execStrategy(strategies)

module.exports.sort = 10
module.exports.test = test
module.exports.exec = exec
