const config = require('config')
const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { getHumanizedDuration } = require('../../../lib/time')

const isUserLucky = servers =>
  servers.length < 2 || Math.random() <= config.get('luck.nscan')

const test = req => {
  return req.state.nscan_end_at == null
}

const exec = req => {
  const { username } = req.session
  const [arg] = getArgs(req.body.line)
  const servers = tables.servers.find({ owner: { $eq: username } })
  const isLucky = isUserLucky(servers)

  const duration = config.get('packages.nscan.scan-time')
  req.state.nscan_end_at = isLucky
    ? new Date()
    : new Date(Date.now() + duration * 1000)
  req.state.nscan_arg = arg
  tables.state.update(req.state)

  const time = getHumanizedDuration(
    Date.parse(req.state.nscan_end_at),
    Date.now()
  )

  return [
    actions.echo(`nscan is scanning.`),
    actions.echo(`Estimated Completion Time: ${time}`)
  ]
}

module.exports = {
  sort: 100,
  test,
  exec
}
