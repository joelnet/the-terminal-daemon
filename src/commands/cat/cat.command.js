//const { allPass } = require('mojiscript')
const path = require('path')
const { isCommand } = require('../../lib/command')
const { execStrategy, getStrategies } = require('../../lib/strategies')

const name = 'cat'
const strategyPath = path.join(__dirname, '**/*.strategy.js')
const strategies = getStrategies(strategyPath)
const test = isCommand(name)
const exec = execStrategy(strategies)
// const exec = req => {
// const {
//   username,
//   env: { PWD: pwd }
// } = req.session
// }

module.exports = {
  sort: 10,
  test,
  exec,
  name
}

// TODO: use strategy pattern, like wallet
// const { isCommand, getArgs } = require('../../lib/command')
// const actions = require('../../actions')
// const { getDir } = require('../../filesystem/getDir')
// const { tables } = require('../../stores/fs')
// const { dirExists } = require('../../filesystem')
// const { fileExists } = require('../../filesystem')

// const test = isCommand('cat')

// const exec = req => {
//   const {
//     username,
//     env: { PWD: pwd }
//   } = req.session

//   const [arg] = getArgs(req.body.line)
//   const path = getDir({ username, pwd, dir: arg })

//   if (dirExists({ dir: path, username, session: req.session })) {
//     return [actions.echo(`cat: ${arg}: Is directory`)]
//   }

//   if (!fileExists({ dir: path, username, session: req.session })) {
//     return [actions.echo(`cat: ${arg}: No such file or directory`)]
//   }

//   if (path === `/home/${username}/servers`) {
//     const servers = tables.servers.find({
//       owner: { $eq: username },
//       address: { $ne: 'home' }
//     })
//     return [actions.echo(servers.map(server => server.address).join('\n'))]
//   }

//   return [actions.echo(`cat: ${arg}: File cannot be output`)]
// }

// module.exports = {
//   sort: 10,
//   test,
//   exec
// }
