const { tables } = require('./stores/fs')

const getMail = username =>
  username === 'root' ? [] : tables.mail.find({ username: { $eq: username } })

const setRead = mail => {
  mail.read_at = new Date()
  tables.mail.update(mail)
  return mail
}

const isUnread = mail => mail.read_at == null

module.exports = {
  getMail,
  isUnread,
  setRead
}
