const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')
const { fileExists } = require('../../../filesystem')
const { getDir } = require('../../../filesystem/getDir')

const test = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session
  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })
  return !fileExists({ dir: path, username, session: req.session })
}
const exec = req => {
  const [arg] = getArgs(req.body.line)
  return [actions.echo(`cat: ${arg}: No such file or directory`)]
}
module.exports = {
  sort: 20,
  test,
  exec
}
