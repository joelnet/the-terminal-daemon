const { dirExists } = require('../../../filesystem')
const { getDir } = require('../../../filesystem/getDir')
const { getArgs } = require('../../../lib/command')
const actions = require('../../../actions')

const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'dirExist'
}

const exec = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session
  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })

  if (dirExists({ dir: path, username, session: req.session })) {
    return [actions.echo(`cat: ${arg}: Is directory`)]
  }
}

module.exports = {
  sort: 10,
  test,
  exec
}
