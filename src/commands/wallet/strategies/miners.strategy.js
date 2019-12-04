// @ts-check
const { default: chalk } = require('chalk')
const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { tables } = require('../../../stores/fs')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => {
  const [command] = getArgs(req.body.line)
  return command === 'miners'
}

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const servers = tables.servers
    .find({ owner: { $eq: req.session.username } })
    .filter(
      ({ packages }) => packages != null && packages.some(p => p === 'coind')
    )

  if (servers.length < 1) {
    return [actions.echo('coind was not found to be running on any servers')]
  }

  return servers.map(({ address, state = {} }) => {
    const running = state.COIND && state.COIND.status === 'on'
    return actions.echo(
      `${
        running
          ? chalk.bgGreen.black(' Running ')
          : chalk.bgRed.black(' Stopped ')
      } ${address}`
    )
  })
}

module.exports = {
  sort: 10,
  test,
  exec
}
