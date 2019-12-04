// @ts-check
const { getArgs } = require('../../../lib/command')
const { sessions } = require('../../../stores/memory')
const { getDir } = require('../../../filesystem/getDir')
const { dirExists } = require('../../../filesystem')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const { username } = req.session

  const fullPath = getFullPath(req)

  return dirExists({
    dir: fullPath,
    username,
    session: req.session
  })
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const fullPath = getFullPath(req)

  sessions.updateWhere(
    session => session.id === req.body.id,
    data => {
      data.env.PWD = fullPath
    }
  )
  return []
}

const getFullPath = req => {
  const {
    username,
    env: { PWD: pwd }
  } = req.session
  const [dir = `~`] = getArgs(req.body.line)

  return getDir({ username, pwd, dir })
}

module.exports = {
  sort: 10,
  test,
  exec
}
