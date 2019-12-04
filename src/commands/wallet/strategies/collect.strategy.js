// @ts-check
const { default: chalk } = require('chalk')
const config = require('config')
const { allPass } = require('mojiscript')
const moment = require('moment')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')
const { add } = require('../../../lib/coinmath')
const logger = require('../../../logger')

const reward = config.get('coins.reward')
const cooldown = config.get('packages.wallet.cooldown')
const packagesSelector = ({ packages }) => packages || []
const statusSelector = ({ state }) => state && state.COIND && state.COIND.status

const hasCoind = server => packagesSelector(server).some(p => p === 'coind')
const isOn = server => statusSelector(server) === 'on'

const canCollect = ({ wallet_collect_at }) =>
  wallet_collect_at == null ||
  Date.now() - new Date(wallet_collect_at).getTime() >= 0

const calculateTotalCollected = req => {
  const servers = tables.servers
    .find({ owner: { $eq: req.session.username } })
    .filter(allPass([hasCoind, isOn]))

  const total = Number((reward * servers.length).toFixed(8))
  return total
}

const getHumanizedDuration = time => {
  const ms = Date.parse(time) - Date.now()
  const humanized = moment.duration(ms, 'milliseconds').humanize()
  return humanized
}

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => getArgs(req.body.line)[0] === 'collect'

const cannotCollect = state => [
  actions.echo('miners are still mining'),
  actions.echo(
    `Estimated Completion Time: ${getHumanizedDuration(
      state.wallet_collect_at
    )}`
  )
]

const doCollect = (req, state) => {
  const collectedAmount = calculateTotalCollected(req)

  state.wallet_collect_at = new Date(Date.now() + cooldown * 1000)
  state.coins = add(state.coins, collectedAmount)
  tables.state.update(state)

  return [
    actions.echo(
      chalk`Collected {cyan.bold ${collectedAmount.toString()}} coin`
    )
  ]
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const { state } = req
  logger.debug(`\`wallet collect\` executed by \`${req.session.username}\``)
  return !canCollect(state) ? cannotCollect(state) : doCollect(req, state)
}

module.exports = {
  sort: 10,
  test,
  exec,
  canCollect
}
