const { isCommand, getArgs } = require('../lib/command')
const { sessions } = require('../stores/memory')
const actions = require('../actions')
const { dirExists } = require('../filesystem')
const { getDir } = require('../filesystem/getDir')

const test = isCommand('cd')

const exec = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session

  const [dir = `~`] = getArgs(req.body.line)
  const fullPath = getDir({ username, pwd, dir })
  const pathExists = dirExists({
    dir: fullPath,
    username,
    session: req.session
  })
  if (pathExists) {
    sessions.updateWhere(
      session => session.id === req.body.id,
      data => {
        data.env.PWD = fullPath
      }
    )
    return []
  } else {
    return [actions.echo(`cd: ${fullPath}: No such file or directory`)]
  }
}

module.exports = {
  sort: 10,
  test,
  exec
}
