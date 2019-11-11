const actions = require('../../../actions')
const { dirExists } = require('../../../filesystem')
const { getDir } = require('../../../filesystem/getDir')
const { getArgs } = require('../../../lib/command')

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

const test = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session
  const path = getDir({ username, pwd, dir: arg })
  dirExists({ dir: path, username, session: req.session })
}

module.exports = {
  sort: 10,
  test,
  exec
}
