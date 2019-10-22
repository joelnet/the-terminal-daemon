const { tables } = require('./stores/fs')

/**
 * @param {string} username
 */
const step1 = username => {
  tables.mail.insert({ username, template: 'welcome' })
}

/**
 * @param {string} username
 */
const step2 = username => {
  tables.mail.findAndRemove({
    username: { $eq: username },
    template: { $eq: 'welcome' }
  })

  tables.mail.insert({ username, template: 'xssh' })
}

/**
 * @param {string} username
 */
const step3 = username => {
  const mail = tables.mail.find({
    username: { $eq: username },
    template: { $eq: 'xssh' }
  })[0]

  if (mail) {
    tables.mail.remove(mail)
    tables.mail.insert({ username, template: 'wallet' })
  }
}

/**
 * @param {string} username
 * @param {string} coins
 */
const step4 = (username, coins) => {
  if (Number(coins) <= 0) {
    return
  }

  const mail = tables.mail.find({
    username: { $eq: username },
    template: { $eq: 'wallet' }
  })[0]

  if (mail) {
    tables.mail.remove(mail)
    tables.mail.insert({ username, template: 'last' })
  }
}

module.exports = {
  step1,
  step2,
  step3,
  step4
}
