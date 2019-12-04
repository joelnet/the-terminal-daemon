//@ts-check
// TODO: use strategy pattern, like wallet
const { default: chalk } = require('chalk')
const config = require('config')
const { isCommand, getArgs } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const tutorial = require('../tutorial')
const { meetsRequirement } = require('./train.command.js')

const name = 'pkg'

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

/**
 * @type { import('../types/strategy').StrategyTest }
 */
const test = isCommand(name)

const getServer = (owner, address) => {
  const server =
    tables.servers.find({ owner, address })[0] ||
    tables.servers.insert({
      owner,
      address,
      packages: []
    })

  server.packages = server.packages || []

  return server
}

/**
 * @type { import('../types/strategy').StrategyExec }
 */
const exec = req => {
  const [action, pkg] = getArgs(req.body.line)
  const { session, state } = req
  const { username, env } = session

  if (req.session.username === 'root') {
    return [actions.echo(chalk.red(`E: ${name}: root is restricted`))]
  }

  if (action == null) {
    return [actions.echo(`Usage: ${name} install package`)]
  }

  if (action !== 'install') {
    return [actions.echo(`pkg: Invalid operation ${action}`)]
  }

  const [, packageOptions] =
    Object.entries(config.get('packages')).find(([name]) => name === pkg) || []

  if (!packageOptions) {
    return [actions.echo(`pkg: Invalid package ${pkg}`)]
  }

  if (
    (req.session.env.HOST === 'home' && !packageOptions.home) ||
    (req.session.env.HOST !== 'home' && !packageOptions.remote)
  ) {
    return [
      actions.echo(
        chalk.red(`pkg: ${pkg} cannot be installed on ${req.session.env.HOST}`)
      )
    ]
  }

  const invalid = (packageOptions.require || [])
    .filter(requirement => !meetsRequirement({ session, requirement, state }))
    .map(requirement => {
      const [, lessonName] = requirement.split(':')
      return actions.echo(
        chalk`{cyan.bold ${pkg}} Cannot be installed. Required skill {cyan.bold ${lessonName}} is missing.`
      )
    })
  if (invalid.length > 0) {
    return invalid
  }

  const server = getServer(username, env.HOST)

  if (server.packages.some(p => p === pkg)) {
    return [actions.echo(`pkg: Already installed ${pkg}`)]
  }

  if (pkg === 'nscan') {
    tutorial.step2(req.session.username)
  }

  if (pkg === 'coind' && server.type === '1') {
    return [actions.echo(`pkg: ${pkg} cannot be installed on an iot device`)]
  }

  server.packages.push(pkg)
  tables.servers.update(server)
  return generateLog({ pkg, size: '1,667 kB' })

  return [actions.echo(`pkg: Invalid package ${pkg}`)]
}

module.exports = {
  sort: 10,
  test,
  exec,
  getServer
}
