/**
 * @type { import('../../../types/strategy').StrategyTest }
 */
const test = req => req.body.password1 == ''

/**
 * @type { import('../../../types/strategy').StrategyExec }
 */
const exec = () => []

module.exports = {
  sort: 10,
  test,
  exec
}
