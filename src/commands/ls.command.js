const { isCommand, getArgs } = require('../lib/command')
const { ls } = require('../filesystem')
const actions = require('../actions')
const { getDir } = require('../filesystem/getDir')

const test = isCommand('ls')

const exec = req => {
  const {
    username,
    env: { PWD }
  } = req.session

  const arg = getArgs(req.body.line)[0]
  const dir = getDir({ username, pwd: PWD, dir: arg })

  return ls({ path: dir, username, session: req.session }).getValue(
    () => [actions.echo(`ls: ${dir}: No such file or directory`)],
    files => [actions.echo(files.map(o => o.name).join('\n'))]
  )
}

module.exports = {
  sort: 10,
  test,
  exec
}
