const chalk = require('chalk')
const { tables } = require('./stores/fs')
const { sessions } = require('./stores/memory')
const actions = require('./actions')

const getMail = username =>
  username === 'root' ? [] : tables.mail.find({ username: { $eq: username } })

const setRead = mail => {
  mail.read_at = new Date()
  tables.mail.update(mail)
  return mail
}

const isUnread = mail => mail.read_at == null

const setPrompt = req => {
  const { username } = sessions.find({ id: { $eq: req.body.id } })[0]
  const displayName = req.session.env.USER
  const mail =
    username === displayName ? getMail(username).filter(isUnread) : []

  return [
    actions.setPrompt(
      mail.length
        ? `[${chalk.bold.yellow('NEW MAIL')}]:${chalk.bold.green(displayName)}$ ` // prettier-ignore
        : `${chalk.bold.green(displayName)}$ `
    )
  ]
}

module.exports = {
  getMail,
  setRead,
  setPrompt
}
