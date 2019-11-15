// TODO: use strategy pattern, like wallet
// TODO: do not store training on user, but in tables.state
const chalk = require('chalk')
const config = require('config')
const { allPass } = require('mojiscript')
const { isCommand, getArgs } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const { doesServerHavePackage } = require('./lib/doesServerHavePackage')
const { fileExists } = require('../filesystem/fileExists')
const { getHumanizedDuration } = require('../lib/time')
const { chalkTemplate } = require('../lib/strings')
const logger = require('../logger')

const name = 'train'

const allTraining = config.get('training')

const getTime = state =>
  getHumanizedDuration(Date.parse(state.training_currently.end_at), Date.now())

const humanizeLesson = ([name, value]) =>
  chalk`{bold.cyan ${name}: ${value.headline}}
  
  ${chalkTemplate(value.body.replace(/\n/g, '\n  '))}`

const meetsRequirement = ({
  session,
  requirement,
  state: { username, training = [] }
}) =>
  (requirement.startsWith('training:') &&
    training.some(t => t === requirement.substr(9))) ||
  (requirement.startsWith('command:') &&
    fileExists({ dir: '/bin/nscan', username, session }))

const getAvailableTraining = ({
  session,
  state: { username, training = [] }
}) => {
  return Object.keys(allTraining)
    .map(key => [key, allTraining[key]])
    .filter(([key, value]) => {
      // already have trained
      if (training.some(k => k === key)) return false

      // meets requirement
      if (
        (value.require || []).every(requirement =>
          meetsRequirement({
            session,
            requirement,
            state: { username, training }
          })
        )
      ) {
        return true
      }

      return false
    })
}

const isScanRunning = state =>
  state.training_currently &&
  state.training_currently.end_at &&
  Date.parse(state.training_currently.end_at) - Date.now() >= 0

const completeTraining = req => {
  const lesson = req.state.training_currently.lesson
  const rewards = config.get('training')[lesson].rewards || []

  // TODO: Calculate User Luck and set new value

  req.state.training = req.state.training || []
  req.state.training.push(req.state.training_currently.lesson)
  delete req.state.training_currently
  tables.state.update(req.state)

  return [
    actions.echo(
      chalk`{bgCyan.black  training: } Training of {cyan.bold ${lesson}} is complete.`
    ),
    ...rewards.map(reward => {
      if (reward.startsWith('pkg:')) {
        const pkg = reward.substr(4)
        return actions.echo(chalk`package {cyan.bold ${pkg}} is available.
type {cyan.bold pkg install ${pkg}} to install.`)
      }
    })
  ]
}

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const [arg] = getArgs(req.body.line)

  const myTraining = getAvailableTraining({
    session: req.session,
    state: req.state
  })

  if (arg != null && !myTraining.some(([key]) => key === arg)) {
    return [actions.echo(`${name}: ${arg}: Not a valid option`)]
  }

  if (arg != null && req.state.training_currently != null) {
    return [actions.echo(`${name}: Must wait until training has completed`)]
  }

  if (arg != null) {
    logger.debug(`\`train\` executed by \`${req.session.username}\``)
    const [, { time: duration }] = myTraining.find(([key]) => key === arg)
    req.state.training_currently = {
      lesson: arg,
      end_at: new Date(Date.now() + duration * 1000)
    }

    tables.state.update(req.state)

    return [
      actions.echo(chalk`Training {cyan.bold ${arg}}`),
      actions.echo(`Estimated Completion Time: ${getTime(req.state)}`)
    ]
  }

  if (req.state.training_currently != null && !isScanRunning(req.state)) {
    return completeTraining(req)
  }

  if (req.state.training_currently != null) {
    const [, { headline }] = myTraining.find(
      ([key]) => key === req.state.training_currently.lesson
    )
    return [
      actions.echo(
        chalk`Training {cyan.bold ${req.state.training_currently.lesson}: ${headline}} in progress.`
      ),
      actions.echo(`Estimated Completion Time: ${getTime(req.state)}`)
    ]
  }

  return myTraining
    .map(humanizeLesson)
    .join('\n\n')
    .split('\n')
    .map(actions.echo)
}

module.exports = {
  sort: 10,
  test,
  exec,
  name,
  isScanRunning,
  completeTraining
}
