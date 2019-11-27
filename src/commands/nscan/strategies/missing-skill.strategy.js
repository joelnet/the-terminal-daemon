const chalk = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { trainingSelector } = require('../../../stores/selectors')

const types = {
  iot: 'scan-02',
  pc: 'scan-03'
}

const test = req => {
  const [arg] = getArgs(req.body.line)
  const { state } = req

  return (
    (arg === 'iot' && !trainingSelector(state).includes(types[arg])) ||
    (arg === 'pc' && !trainingSelector(state).includes(types[arg]))
  )
}

const exec = req => {
  const [type] = getArgs(req.body.line)
  return [
    actions.echo(
      chalk`{red.bold Error:} skill {cyan.bold ${types[type]}} missing.`
    )
  ]
}

module.exports = {
  sort: 10,
  test,
  exec
}
