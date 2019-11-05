const { anyPass } = require('mojiscript')
const { isCommand } = require('../lib/command')

const test = anyPass([isCommand(''), isCommand('noop')])

const exec = () => []

module.exports = {
  sort: 10,
  test,
  exec
}
