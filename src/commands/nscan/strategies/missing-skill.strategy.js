const chalk = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { trainingSelector } = require('../../../stores/selectors')

const test = req => {
  const [arg] = getArgs(req.body.line)
  const { state } = req

  return arg === 'iot' && !trainingSelector(state).includes('scan-02')
}

const exec = () => [
  actions.echo(chalk`{red.bold Error:} skill {cyan.bold scan-02} missing.`)
]

module.exports = {
  sort: 10,
  test,
  exec
}
