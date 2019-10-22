const { isCommand } = require('../lib/command')
const actions = require('../actions')

const test = isCommand('pwd')

const exec = req => {
  const {
    env: { PWD }
  } = req.session
  return [actions.echo(PWD)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
