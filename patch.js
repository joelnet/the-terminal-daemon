// @ts-check
const { db, tables, onLoad } = require('./src/stores/fs')

onLoad(() => {
  const mails = tables.mail.find({
    template: { $eq: 'last' }
  })

  const usernames = mails.map(({ username }) => username)

  mails.forEach(mail => tables.mail.remove(mail))

  usernames.forEach(username =>
    tables.mail.insert({ username, template: 'cryptolock' })
  )

  console.log('done.')

  db.close()
})
