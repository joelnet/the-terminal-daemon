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

const name = 'train'

const allTraining = config.get('training')

const getTime = user =>
  getHumanizedDuration(Date.parse(user.training_currently.end_at), Date.now())

const humanizeLesson = ([name, value]) =>
  chalk`{bold.cyan ${name}: ${value.headline}}
  
  ${chalkTemplate(value.body.replace(/\n/g, '\n  '))}`

const meetsRequirement = ({
  session,
  requirement,
  user: { username, training = [] }
}) =>
  (requirement.startsWith('training:') &&
    training.some(t => t === requirement.substr(9))) ||
  (requirement.startsWith('command:') &&
    fileExists({ dir: '/bin/nscan', username, session }))

const getAvailableTraining = ({
  session,
  user: { username, training = [] }
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
            user: { username, training }
          })
        )
      ) {
        return true
      }

      return false
    })
}

const isScanRunning = user =>
  user.training_currently &&
  user.training_currently.end_at &&
  Date.parse(user.training_currently.end_at) - Date.now() >= 0

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const { username } = req.session
  const [arg] = getArgs(req.body.line)
  const user = tables.users.find({ username: { $eq: username } })[0]

  const myTraining = getAvailableTraining({ session: req.session, user })

  if (arg != null && !myTraining.some(([key]) => key === arg)) {
    return [actions.echo(`${name}: ${arg}: Not a valid option`)]
  }

  if (arg != null && user.training_currently != null) {
    return [actions.echo(`${name}: Must wait until training has completed`)]
  }

  if (arg != null) {
    const [, { time: duration }] = myTraining.find(([key]) => key === arg)
    user.training_currently = {
      lesson: arg,
      end_at: new Date(Date.now() + duration * 1000)
    }
    tables.users.update(user)

    return [
      actions.echo(chalk`Training {cyan.bold ${arg}}`),
      actions.echo(`Estimated Completion Time: ${getTime(user)}`)
    ]
  }

  if (user.training_currently != null && !isScanRunning(user)) {
    const lesson = user.training_currently.lesson

    // TODO: Calculate User Luck and set new value

    user.training = user.training || []
    user.training.push(user.training_currently.lesson)
    delete user.training_currently
    tables.users.update(user)

    return [actions.echo(chalk`Training of {cyan.bold ${lesson}} is complete.`)]
  }

  if (user.training_currently != null) {
    const [, { headline }] = myTraining.find(
      ([key]) => key === user.training_currently.lesson
    )
    return [
      actions.echo(
        chalk`Training {cyan.bold ${user.training_currently.lesson}: ${headline}} in progress.`
      ),
      actions.echo(`Estimated Completion Time: ${getTime(user)}`)
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
  name
}
