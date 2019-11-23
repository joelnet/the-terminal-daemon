const actions = require('../../../actions')

const test = req => req.body.password1 && !req.body.password2

const exec = req => [
  actions.prompt({
    prompt: 'Retype new password: ',
    type: 'password',
    action: 'exec',
    line: req.body.line,
    key: 'password2',
    history: false,
    state: {
      password1: req.body.password1
    }
  })
]

module.exports = {
  sort: 100,
  test,
  exec
}
