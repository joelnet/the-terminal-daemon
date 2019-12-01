const chalk = require('chalk')
const { sessions } = require('./stores/memory')
const actions = require('./actions')
const { getMail, isUnread } = require('./mail')
const { getHumanizedDuration } = require('./lib/time')
const { tables } = require('./stores/fs')
const { canCollect } = require('./commands/wallet/strategies/collect.strategy')
const { getServer } = require('./commands/pkg.command')

const getMailPrompt = req => {
  const { username } = sessions.find({ id: { $eq: req.body.id } })[0]
  const displayName = req.session.env.USER
  const mail =
    username === displayName ? getMail(username).filter(isUnread) : []
  return mail.length ? chalk.bgRed.black(' NEW MAIL! ') : ''
}

const getTrainingPrompt = req => {
  const isTraining =
    req.state &&
    req.state.training_currently &&
    new Date(req.state.training_currently.end_at) > new Date()
  const lesson = isTraining
    ? req.state.training_currently.lesson
    : 'not training'
  const duration = isTraining
    ? `(${getHumanizedDuration(
        new Date(req.state.training_currently.end_at),
        new Date()
      )})`
    : ''

  return chalk.bgYellow.black(` training: ${lesson} ${duration} `)
}

const getNscanPrompt = req => {
  const isScanning =
    req.state &&
    req.state.nscan_end_at &&
    new Date(req.state.nscan_end_at) > new Date()
  const duration = isScanning
    ? ` nscan: (${getHumanizedDuration(
        new Date(req.state.nscan_end_at),
        new Date()
      )}) `
    : ''

  return chalk.bgCyan.black(duration)
}

const getWalletPrompt = req => {
  const { session, state } = req
  const { username, env } = session

  const server = getServer(username, env.HOST)

  if (!server.packages.some(p => p === 'wallet')) {
    return ''
  }

  if (canCollect(state)) {
    return chalk.bgBlack.green(' wallet: ready! ')
  }

  const { coins = '0' } = tables.state.get(username)
  return chalk.bgBlack.green(` Balance: ${Number(coins).toFixed(8)} `)
}

const getPwd = req =>
  req.session.env.PWD === `/home/${req.session.env.USER}`
    ? '~'
    : req.session.env.PWD

const setPrompt = req => {
  const displayName = req.session.env.USER

  const mailPrompt = getMailPrompt(req)
  const trainingPrompt = getTrainingPrompt(req)
  const nscanPrompt = getNscanPrompt(req)
  const walletPrompt = getWalletPrompt(req)

  const pwd = chalk.red(getPwd(req))

  // TODO: this logic is confusing. clean it up.

  const basicPrompt = chalk.blue(`[${displayName} ${pwd}] `)

  const promptTop =
    req.session.env.HOST !== 'home'
      ? chalk`\n┌ {bgRed.black  HACKED: ${req.session.env.HOST} }`
      : chalk`\n┌ ${mailPrompt}${trainingPrompt}${nscanPrompt}${walletPrompt}`

  const promptBottom =
    displayName === 'root' && req.session.env.HOST === 'home'
      ? basicPrompt
      : chalk`└ ${basicPrompt}`

  return displayName === 'root' && req.session.env.HOST === 'home'
    ? [actions.setPrompt(promptBottom)]
    : [actions.echo(promptTop), actions.setPrompt(promptBottom)]
}

module.exports = {
  setPrompt
}
