const { getCommand } = require('../lib/command')
const actions = require('../actions')

const test = () => true

const exec = req => {
  const command = getCommand(req.body.line)
  return [actions.echo(`${command}: command not found`)]
}

module.exports = {
  sort: 100,
  test,
  exec
}
