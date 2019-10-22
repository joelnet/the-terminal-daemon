const { files } = require('./files')
const { Nothing, Just } = require('mojiscript')
const { getBinDirectory } = require('./getBinDirectory')
const { getHomeDirectory } = require('./getHomeDirectory')

const ls = ({ path, username, session, fs = files }) => {
  const [head, ...tail] = path
    .split('/')
    .slice(path.substr(0, 1) === '/' ? 1 : 0)

  const directory = fs.find(({ name, type }) => name === head && type === 'd')

  if (directory && tail.length === 0 && path.substr(0, 1) != '/') {
    return Just(directory.fs)
  }

  if (directory && path.substr(0, 1) != '/') {
    return ls({ path: tail.join('/'), username, session, fs: directory.fs })
  }

  if (path === '/') {
    return Just(fs)
  }

  if (path.substr(0, 4) === '/bin') {
    return ls({
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
    return ls({
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
  ls
}
