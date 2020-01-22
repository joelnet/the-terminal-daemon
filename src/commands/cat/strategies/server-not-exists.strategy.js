const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { getDir } = require('../../../filesystem/getDir')

const test = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session
  const [arg] = getArgs(req.body.line)
  const path = getDir({ username, pwd, dir: arg })
  return path !== `/home/${username}/servers`
}

const exec = req => {
  const [arg] = getArgs(req.body.line)
  return [actions.echo(`cat: ${arg}: File cannot be output`)]
}

module.exports = {
  sort: 100,
  test,
  exec
}
