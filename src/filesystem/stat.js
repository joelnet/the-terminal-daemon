const { files } = require('./files')
const { Nothing, Just } = require('mojiscript')
const { getBinDirectory } = require('./getBinDirectory')
const { getHomeDirectory } = require('./getHomeDirectory')

const stat = ({ path, username, session, fs = files }) => {
  const [head, ...tail] = path
    .split('/')
    .slice(path.substr(0, 1) === '/' ? 1 : 0)

  const file = fs.find(({ name }) => name === head)

  if (file && tail.length === 0) {
    return Just(file)
  }

  if (file && file.type === 'd' && path.substr(0, 1) != '/') {
    return stat({ path: tail.join('/'), username, session, fs: file.fs })
  }

  if (path === '/') {
    return Just({ name: '/', type: 'd', fs })
  }

  if (path.substr(0, 4) === '/bin') {
    return stat({
      path: path.substr(1),
      username,
      session,
      fs: [
        {
          name: 'bin',
          type: 'd',
          fs: getBinDirectory(username, session.env.HOST)
        }
      ]
    })
  }

  if (path.substr(0, 5) === '/home') {
    return stat({
      path: path.substr(1),
      username,
      session,
      fs: [
        {
          name: 'home',
          type: 'd',
          fs: getHomeDirectory(session.env.USER, session.env.HOST)
        }
      ]
    })
  }

  return Nothing
}

module.exports = {
  stat
}
