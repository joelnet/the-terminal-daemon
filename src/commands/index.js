const path = require('path')
const { setPrompt } = require('../mail')
const { getStrategies, execStrategy } = require('../lib/strategies')

const strategies = getStrategies(path.join(__dirname, '**/*.command.js'))

const exec = async (req, res) => {
  const response = await execStrategy(strategies)(req, res)
  const withPrompt = response.concat(setPrompt(req, res))
  return res.json(withPrompt)
}

module.exports = {
  exec
}
