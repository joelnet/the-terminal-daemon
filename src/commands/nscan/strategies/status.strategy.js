// @ts-check
const actions = require('../../../actions')
const { getHumanizedDuration } = require('../../../lib/time')

/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = () => true

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = req => {
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
