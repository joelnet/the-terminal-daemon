const { isCommand } = require('../lib/command')
const actions = require('../actions')

const test = isCommand('clear')

const exec = () => {
  return [actions.echo('\u001b[2J\u001b[0;0H', { crlf: false })]
}

module.exports = {
  sort: 10,
  test,
  exec
}
