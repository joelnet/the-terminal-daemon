const boxen = require('boxen')
const chalk = require('chalk')
const config = require('config')
const express = require('express')
const uuidv4 = require('uuid/v4')
const { sessions } = require('../stores/memory')
const { tables } = require('../stores/fs')
const { validatePassword } = require('../lib/password')
const { setPrompt } = require('../mail')
const actions = require('../actions')
const { logo } = require('../../logo')

const router = express.Router()

const rootUser = config.get('root.user')
const rootPass = config.get('root.pass')

/**
 * Add uuid to req.body.id and session
 */
const addUuid = req => {
  if (req.body.id) {
    return
  }

  const id = uuidv4()
  sessions.insert({ id })
  req.body.id = id
}

const promptLogin = (req, res) => {
  const messages = []
  const { login_attempt } = sessions.find({ id: { $eq: req.body.id } })[0]

  if (login_attempt > 1) {
    messages.push(actions.echo(chalk.red('\n\nInvalid login attempt')))
  }

  const ip = req.header('x-forwarded-for') || req.connection.remoteAddress

  const welcomeText = `\n${logo}\n\n${boxen(
    config
      .get('copy.welcome-text')
      .trim()
      .replace(/{ADDRESS}/g, chalk.red(ip)),
    { padding: 1, borderStyle: 'double' }
  )}\n`

  return res.json([
    ...messages,
    actions.setState({ id: req.body.id }),
    ...welcomeText.split('\n').map(line => actions.echo(line || ' ')),
    actions.prompt({
      prompt: 'login as: ',
      action: 'login',
      key: 'username',
      history: false
    })
  ])
}

router.get('/login', (req, res) => {
  addUuid(req)
  promptLogin(req, res)
})

const promptPassword = (req, res) => {
  sessions.updateWhere(
    session => session.id === req.body.id,
    data => {
      data.username = req.body.username
    }
  )

  return res.json([
    actions.prompt({
      prompt: `${req.body.username}'s password: `,
      type: 'password',
      action: 'login',
      key: 'password',
      history: false
    })
  ])
}

const loginUser = (req, res) => {
  const session = sessions.find({ id: { $eq: req.body.id } })[0]
  const { username } = session

  sessions.updateWhere(
    session => session.id === req.body.id,
    data => {
      delete data.login_attempt
      data.env = data.env || {}
      data.env.PWD = `/home/${username}`
      data.env.HOST = 'home'
      data.env.USER = username
    }
  )

  return res.json([
    actions.clearHistory(),
    actions.echo('Login Success!'),
    ...setPrompt(req, res)
  ])
}

const validateLogin = (req, res) => {
  const session = sessions.find({ id: { $eq: req.body.id } })[0]
  const user = tables.users.find({ username: { $eq: session.username } })[0]

  if (user == null && session.username !== rootUser) {
    return res.json([actions.echo('Login Failed.'), actions.exit()])
  }

  if (
    (session.username === rootUser && req.body.password === rootPass) ||
    (session.username !== rootUser &&
      validatePassword(req.body.password, user.hash))
  ) {
    return loginUser(req, res)
  }

  sessions.updateWhere(
    session => {
      return session.id === req.body.id
    },
    data => {
      data.login_attempt = (data.login_attempt || 1) + 1
    }
  )

  return promptLogin(req, res)
}

router.post('/login', (req, res) => {
  if (req.body.username) {
    return promptPassword(req, res)
  }

  if (req.body.password) {
    return validateLogin(req, res)
  }

  return res.json([actions.echo('Invalid login attempt'), actions.exit()])
})

module.exports = {
  order: 100,
  router
}
