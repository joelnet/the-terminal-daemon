// @ts-check
const ansi = require('ansi-escapes')
const { tables } = require('../../../stores/fs')
const actions = require('../../../actions')
const { setSessionToHomeServer } = require('../../exit.command')
const { animateProgressBar } = require('../../../lib/progressbar')

const UP = ansi.cursorPrevLine
const delay = 150

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = () => true

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
  const { session } = req
  const { env } = session
  const [server] = tables.servers.find({ address: env.HOST })

  tables.servers.remove(server)

  return [
    ...animateProgressBar({ steps: 10, size: 25 }).map(bar =>
      actions.echo(`${UP}Encrypting hard drive ${bar}`, { delay })
    ),
    actions.echo(
      'The owner did not pay the bounty. The server is permanently unavailable.'
    ),
    ...setSessionToHomeServer(req)
  ]
}

module.exports = {
  sort: 100,
  test,
  exec
}
