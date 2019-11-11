const { getArgs } = require('../../../lib/command')
const { sessions } = require('../../../stores/memory')
const { getDir } = require('../../../filesystem/getDir')
const { dirExists } = require('../../../filesystem')

const test = req => {
    const {
        username,
        env: { PWD: pwd }
      } = req.session
    
    const [dir = `~`] = getArgs(req.body.line)
    const fullPath = getDir({ username, pwd, dir }).replace(/\\/g, '/')

    return dirExists({
        dir: fullPath,
        username,
        session: req.session
      })
}

const exec = req => {
    const {
      username,
      env: { PWD: pwd }
    } = req.session
    const [dir = `~`] = getArgs(req.body.line)
    const fullPath = getDir({ username, pwd, dir }).replace(/\\/g, '/')

    sessions.updateWhere(session => 
        session.id === req.body.id,
        data => {
            data.env.PWD = fullPath
        }
    )
    return []
}

module.exports = {
  sort: 10,
  test,
  exec
}
