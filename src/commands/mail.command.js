const chalk = require('chalk')
const config = require('config')
const { isCommand } = require('../lib/command')
const { setPrompt, getMail, setRead } = require('../mail')
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

  return mails
    .reduce((acc, mail) => {
      const template = chalkTemplate(config.mail[mail.template])

      ;`[${mail.$loki}] >>>>>>>>> \n${template}`
        .split('\n')
        .forEach(line => acc.push(actions.echo(line || ' ')))
      return acc
    }, [])
    .concat(setPrompt(req))
}

module.exports = {
  sort: 10,
  test,
  exec
}
