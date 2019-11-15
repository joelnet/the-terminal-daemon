const chalk = require('chalk')
const config = require('config')
const randomIpv6 = require('random-ipv6')
const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')
const tutorial = require('../../../tutorial')
const logger = require('../../../logger')

const spawnServer = (username, type = 0) => {
  const address = randomIpv6()
  return tables.servers.insert({ owner: username, address, type })
}

const isScanRunning = nscan_end_at =>
  nscan_end_at && Date.parse(nscan_end_at) - Date.now() >= 0

const isUserLucky = servers =>
  servers.length < 2 || Math.random() <= config.get('luck.nscan')

const test = req => {
  const { username } = req.session
  const { nscan_end_at } = req.state
  const servers = tables.servers.find({ owner: { $eq: username } })

  const isLucky = isUserLucky(servers)
  const isStarted = nscan_end_at != null
  const shouldDiscoverServer =
    (!isStarted && isLucky) || (isStarted && !isScanRunning(nscan_end_at))

  return shouldDiscoverServer
}

const exec = req => {
  const { username } = req.session
  const { nscan_arg: arg } = req.state

  const server = spawnServer(username, arg === 'iot' ? 1 : 0)

  logger.info(`\`${username}\`: \`nscan\` found new server`)

  delete req.state.nscan_end_at
  delete req.state.nscan_arg
  tables.state.update(req.state)

  const response =
    server.type === 1
      ? chalk` 
scan report for {cyan.bold ${server.address}}\n
PORT    STATE        SERVICE
22/tcp  {green.bold EXPLOITABLE}  ssh
80/tcp  SECURE       http`
      : chalk` 
scan report for {cyan.bold ${server.address}}\n
PORT    STATE        SERVICE
21/tcp  SECURE       ftp
22/tcp  SECURE       ssh
80/tcp  {green.bold EXPLOITABLE}  http`.join('\n\n')

  tutorial.step2(username)

  return response.split('\n').map(actions.echo)
}

module.exports = {
  sort: 100,
  test,
  exec
}
