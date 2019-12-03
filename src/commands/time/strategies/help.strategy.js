const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

const test = req => {
  const [command] = getArgs(req.body.line)
  return command == null || command == '--help'
}

const exec = () =>
  `usage: time <minutes>
  skip forward in time by <minutes>

  example:
    time 60 # skip forward 60 minutes`
    .split('\n')
    .map(line => actions.echo(line || ' '))

module.exports = {
  sort: 10,
  test,
  exec
}
