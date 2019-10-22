// TODO: use strategy pattern, like wallet
// TODO: do not store scan_end_at in user, but in tables.state
const chalk = require('chalk')
const config = require('config')
const { allPass } = require('mojiscript')
const randomIpv6 = require('random-ipv6')
const { isCommand } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const { doesServerHavePackage } = require('./lib/doesServerHavePackage')
const tutorial = require('../tutorial')
const { getHumanizedDuration } = require('../lib/time')
const { trainingSelector } = require('../stores/selectors')

const name = 'nscan'

const spawnServer = (username, type = 0) => {
  const address = randomIpv6()
  return tables.servers.insert({ owner: username, address, type })
}

const isUserLucky = ({ servers }) =>
  servers.length < 2 || Math.random() <= config.get('luck.nscan')

const isScanRunning = user =>
  user.scan_end_at && Date.parse(user.scan_end_at) - Date.now() >= 0

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const { username } = req.session
  const user = tables.users.find({ username: { $eq: username } })[0]
  const servers = tables.servers.find({ owner: { $eq: username } })

  const isLucky = isUserLucky({ username, servers })
  const isStarted = user.scan_end_at != null
  const shouldDiscoverServer =
    (!isStarted && isLucky) || (isStarted && !isScanRunning(user))

  if (shouldDiscoverServer) {
    delete user.scan_end_at
    tables.users.update(user)

    const servers = [spawnServer(username, 0)]

    if (trainingSelector(user).includes('scan-02')) {
      servers.push(spawnServer(username, 1))
    }

    const response = servers
      .map(({ address, type }) =>
        type === 1
          ? chalk` 
scan report for ${address}\n
PORT    STATE        SERVICE
22/tcp  {green.bold EXPLOITABLE}  ssh
80/tcp  SECURE  http`
          : chalk` 
scan report for ${address}\n
PORT    STATE        SERVICE
21/tcp  SECURE       ftp
22/tcp  SECURE       ssh
80/tcp  {green.bold EXPLOITABLE}  http`
      )
      .join('\n\n')

    tutorial.step2(username)

    return response.split('\n').map(actions.echo)

    //     return [
    //       actions.echo(
    //         `${name}: ${
    //           isLucky ? chalk.bgGreen.black.bold('LUCK') + ' ' : ''
    //         }found a new server`
    //       ),
    //       actions.echo(chalk`scan report for ${server.address}\n
    // PORT    STATE        SERVICE
    // 21/tcp  {green.bold EXPLOITABLE}  ftp
    // 21/tcp  {green.bold EXPLOITABLE}  ssh`)
    //     ]
  }

  if (user.scan_end_at == null) {
    const duration = config.get('commands.nscan.scan-time')
    user.scan_end_at = new Date(Date.now() + duration * 1000)
    tables.users.update(user)
  }

  return [
    actions.echo(`nscan is scanning.`),
    actions.echo(
      `Estimated Completion Time: ${getHumanizedDuration(
        Date.parse(user.scan_end_at),
        Date.now()
      )}`
    )
  ]
}

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
