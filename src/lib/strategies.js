const glob = require('glob')

const strategyLoad = path => require(path)

const strategySort = (a, b) =>
  (a.sort || Number.MAX_VALUE) - (b.sort || Number.MAX_VALUE)

const getStrategies = pattern =>
  glob
    .sync(pattern)
    .map(strategyLoad)
    .sort(strategySort)

const findStrategy = async (strategies, req) => {
  for (const strategy of strategies) {
    if (await strategy.test(req)) {
      return strategy.exec
    }
  }

  return null
}

/**
 * Executes matching Strategy
 * @param {Array} strategies Strategies to find and exec
 * @returns {function({ req: any, res: any }): Promise<Array>}
 */
const execStrategy = strategies => async (req, res) => {
  const strategy = await findStrategy(strategies, req)
  if (strategy == null) {
    throw new Error(`Error: unknown strategy.`)
  }

  return strategy(req, res)
}

module.exports = {
  getStrategies,
  findStrategy,
  execStrategy
}
