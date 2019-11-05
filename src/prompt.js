const chalk = require('chalk')
const { sessions } = require('./stores/memory')
const actions = require('./actions')
const { getMail, isUnread } = require('./mail')
const { getHumanizedDuration } = require('./lib/time')

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
  const lesson = isTraining ? req.state.training_currently.lesson : '--'
  const duration = isTraining
    ? `(${getHumanizedDuration(
        new Date(req.state.training_currently.end_at),
        new Date()
      )})`
    : ''

  return chalk.bgYellow.black(` training: ${lesson} ${duration} `)
}

const getPwd = req =>
  req.session.env.PWD === `/home/${req.session.env.USER}`
    ? '~'
    : req.session.env.PWD

const setPrompt = req => {
  const displayName = req.session.env.USER

  const mailPrompt = getMailPrompt(req)
  const trainingPrompt = getTrainingPrompt(req)
  const pwd = chalk.red(getPwd(req))

  // TODO: this logic is confusing. clean it up.

  const basicPrompt = chalk.blue(`[${displayName} ${pwd}] `)

  const promptTop =
    req.session.env.HOST !== 'home'
      ? chalk`\n┌ {bgRed.black EXPLOITED: ${req.session.env.HOST}}`
      : chalk`\n┌ ${mailPrompt}${trainingPrompt}`

  const promptBottom =
    displayName === 'root' ? basicPrompt : chalk`└ ${basicPrompt}`

  return displayName === 'root' && req.session.env.HOST === 'home'
    ? [actions.setPrompt(promptBottom)]
    : [actions.echo(promptTop), actions.setPrompt(promptBottom)]
}

module.exports = {
  setPrompt
}
