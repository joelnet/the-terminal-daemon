const actions = require('../../../actions')
const { getArgs } = require('../../../lib/command')
const { addSpan } = require('../../../features/time')
const { tables } = require('../../../stores/fs')

const test = req => {
  const [arg] = getArgs(req.body.line)
  return arg != null && Number(arg) >= 0
}

const exec = req => {
  const { state } = req
  const [arg] = getArgs(req.body.line)
  const minutes = Math.min(Number(arg), Number(state.time))

  if (state.nscan_end_at != null) {
    state.nscan_end_at = addSpan(
      new Date(state.nscan_end_at),
      1000 * 60 * -minutes
    )
  }

  if (state.wallet_collect_at != null) {
    state.wallet_collect_at = addSpan(
      new Date(state.wallet_collect_at),
      1000 * 60 * -minutes
    )
  }

  if (state.training_currently != null) {
    state.training_currently.end_at = addSpan(
      new Date(state.training_currently.end_at),
      1000 * 60 * -minutes
    )
  }

  state.time -= minutes

  tables.state.update(state)

  return [actions.echo(`You have moved forward in time by ${minutes} minutes`)]
}

module.exports = {
  sort: 10,
  test,
  exec
}
