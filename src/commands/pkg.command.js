// TODO: use strategy pattern, like wallet
const chalk = require('chalk')
const { isCommand, getArgs } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const coind = require('../commands/coind.command')
const nscan = require('../commands/nscan/nscan.command')
const wallet = require('../commands/wallet/wallet.command')
const xssh = require('../commands/xssh.command')
const { isTrained, findLessonByReward } = require('../training')

const name = 'pkg'

const packages = [nscan.name, xssh.name, coind.name, wallet.name]

const generateLog = ({ pkg, size }) =>
  `Reading package lists...
Building dependency tree...
Reading state information...
The following NEW packages will be installed:
  ${pkg}
0 upgraded, 1 newly installed, 0 to remove.
Need to get ${size} of archives.
After this operation, 26.4 MB of additional disk space will be used.
Get:1 http://linux-packages.com disco/main amd64 ${pkg} amd64 [${size}]
Fetched ${size} in 1s (${size}/s)
Selecting previously unselected package ${pkg}.
Preparing to unpack .../${pkg} ...
Unpacking ${pkg} ...
Setting up ${pkg} ...`
    .split('\n')
    .map(log => actions.echo(log, { delay: Math.random() * 500 }))

const test = isCommand(name)

const exec = req => {
  const [action, pkg] = getArgs(req.body.line)
  const { username, env } = req.session

  if (req.session.username === 'root') {
    return [actions.echo(chalk.red(`E: ${name}: root is restricted`))]
  }

  if (action == null) {
    return [actions.echo(`Usage: ${name} install package`)]
  }

  if (action !== 'install') {
    return [actions.echo(`pkg: Invalid operation ${action}`)]
  }

  if (req.session.env.HOST !== 'home' && pkg === 'wallet') {
    return `Reading package lists...
Building dependency tree...
Reading state information...
E: Unable to locate package ${pkg}`
      .split('\n')
      .map(log => actions.echo(log, { delay: Math.random() * 500 }))
  }

  if (packages.some(p => p === pkg)) {
    const server =
      tables.servers.find({ owner: username, address: env.HOST })[0] ||
      tables.servers.insert({
        owner: username,
        address: env.HOST,
        packages: []
      })

    server.packages = server.packages || []

    if (server.packages.some(p => p === pkg)) {
      return [actions.echo(`pkg: Already installed ${pkg}`)]
    }

    const [lessonName, lesson] = findLessonByReward(`pkg:${pkg}`) || []

    if (lesson && !isTrained(lessonName)(req.state)) {
      return [
        actions.echo(
          chalk`{cyan.bold ${pkg}} Cannot be installed\nRequired skill {cyan.bold ${lessonName}} is missing.`
        )
      ]
    }

    server.packages.push(pkg)
    tables.servers.update(server)
    return generateLog({ pkg, size: '1,668 kB' })
  }

  return [actions.echo(`pkg: Invalid package ${pkg}`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
