const chalk = require('chalk')
const config = require('config')
const { isCommand } = require('../lib/command')
const { getMail, setRead } = require('../mail')
const actions = require('../actions')

const test = isCommand('mail')

const chalkTemplate = template => {
  const chalked = [template]
  chalked.raw = chalked
  return chalk(chalked)
}

const exec = req => {
  const { username } = req.session

  const mails = getMail(username)

  if (mails.length === 0) {
    return [actions.echo('No Mail')]
  }

  mails.forEach(mail => setRead(mail))

  return mails.reduce((acc, mail) => {
    // TODO: this code is shit. un-shit it.
    const options = config.mail[mail.template]
    const { tasks = [], text = options } = options
    let template = chalkTemplate(text)

    if (tasks.length) {
      template += chalk`\n{bgGreen.black  Hints: }`
      template += tasks.map(task => {
        if (task.train != null) {
          return chalk`
  - type {cyan.bold train} to access the training system
  - type {cyan.bold train ${task.train}} to train`
        }
        if (task.run != null) {
          return chalk`
  - type {cyan.bold ${task.run}} to run the package`
        }
      })
    }

    return [
      ...acc,
      ...chalk`\n{cyan  >>>>> [ message ${mail.$loki} ] >>>>> }\n${template}`
        .split('\n')
        .map(line => actions.echo(line || ' '))
    ]
  }, [])
}

module.exports = {
  sort: 10,
  test,
  exec
}
