// @ts-check
const { tables } = require('./stores/fs')

/**
 * @param {string} username
 * @param {string} current
 * @param {string} next
 */
const nextMail = (username, current, next) => {
  const mails = tables.mail.find({
    username: { $eq: username },
    template: { $eq: current }
  })

  if (!mails.length) return

  mails.forEach(mail => tables.mail.remove(mail))
  tables.mail.insert({ username, template: next })
}

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
  nextMail(username, 'welcome', 'trained')
}

/**
 * @param {string} username
 */
const step3 = username => {
  nextMail(username, 'trained', 'exploitable')
}

/**
 * @param {string} username
 * @param {string} lesson
 */
const train = (username, lesson) => {
  if (lesson === 'crypto-01') return nextMail(username, 'exploitable', 'xssh')
  if (lesson === 'time-03') return nextMail(username, 'time', 'cryptolock')
  if (lesson === 'crypto-02') return nextMail(username, 'cryptolock', 'ransom')
}

/**
 * @param {string} username
 */
const step5 = username => {
  nextMail(username, 'xssh', 'wallet')
}

/**
 * @param {string} username
 * @param {string} coins
 */
const step6 = (username, coins) => {
  if (Number(coins) > 0 === false) return
  nextMail(username, 'wallet', 'time')
}

module.exports = {
  train,
  step1,
  step2,
  step3,
  step5,
  step6
}
