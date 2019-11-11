const { fileExists } = require('../../../filesystem')
const { getDir } = require('../../../filesystem/getDir')
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

const exec = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session

  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })

  if (!fileExists({ dir: path, username, session: req.session })) {
    return [actions.echo(`cat: ${arg}: No such file or directory`)]
  }
}

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'fileExist'
}

module.exports = {
  sort: 10,
  test,
  exec
}
