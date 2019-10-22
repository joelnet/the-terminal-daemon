// TODO: use strategy pattern, like wallet
const chalk = require('chalk')
const { allPass } = require('mojiscript')
const { isCommand, getArgs } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const { doesServerHavePackage } = require('./lib/doesServerHavePackage')
const tutorial = require('../tutorial')

const name = 'coind'
const commands = ['start', 'stop', 'status', '--help']

const isCommandValid = command =>
  command != null && commands.some(o => o === command)

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const { username } = req.session
  const [command] = getArgs(req.body.line)

  if (command != null || command === '--help') {
    if (!isCommandValid(command)) {
      return [actions.echo(`${name}: ${command}: Invalid command`)]
    }

    const server = tables.servers.find({
      address: { $eq: req.session.env.HOST }
    })[0]

    const state = server.state || (server.state = {})

    if (command === 'start') {
      state.COIND = state.COIND || {}
      state.COIND.status = 'on'
      tables.servers.update(server)

      if (server.address !== 'home') {
        tutorial.step3(username)
      }

      return [actions.echo(`${name}: Started`)]
    }

    if (command === 'stop') {
      state.COIND = state.COIND || {}
      state.COIND.status = 'off'
      tables.servers.update(server)
      return [actions.echo(`${name}: Stopped`)]
    }

    if (command === 'status') {
      const running = state.COIND != null && state.COIND.status === 'on'
      return [
        actions.echo(
          `${name}: ${running ? chalk.green('Running') : chalk.red('Stopped')}`
        )
      ]
    }
  }

  return [
    actions.echo(chalk`Usage: ${name} command

  {underline command}  {underline description}
  status   shows the running status
  start    starts the coin daemon
  stop     stops the coin daemon`)
  ]
}

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
