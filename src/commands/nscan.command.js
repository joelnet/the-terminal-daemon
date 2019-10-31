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
const logger = require('../logger')

const name = 'nscan'

const spawnServer = (username, type = 0) => {
  const address = randomIpv6()
  return tables.servers.insert({ owner: username, address, type })
}

const isUserLucky = ({ servers }) =>
  servers.length < 2 || Math.random() <= config.get('luck.nscan')

const isScanRunning = ({ scan_end_at }) =>
  scan_end_at && Date.parse(scan_end_at) - Date.now() >= 0

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const { username } = req.session
  const { nscan_end_at } = req.state
  const servers = tables.servers.find({ owner: { $eq: username } })

  const isLucky = isUserLucky({ username, servers })
  const isStarted = nscan_end_at != null
  const shouldDiscoverServer =
    (!isStarted && isLucky) || (isStarted && !isScanRunning(req.state))

  if (shouldDiscoverServer) {
    logger.info(`\`${username}\`: \`nscan\` found new server`)
    delete req.state.nscan_end_at
    tables.state.update(req.state)

    const servers = [spawnServer(username, 0)]

    if (trainingSelector(req.state).includes('scan-02')) {
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
  }

  if (nscan_end_at == null) {
    const duration = config.get('commands.nscan.scan-time')
    req.state.nscan_end_at = new Date(Date.now() + duration * 1000)
    tables.state.update(req.state)
  }

  return [
    actions.echo(`nscan is scanning.`),
    actions.echo(
      `Estimated Completion Time: ${getHumanizedDuration(
        Date.parse(req.state.nscan_end_at),
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
