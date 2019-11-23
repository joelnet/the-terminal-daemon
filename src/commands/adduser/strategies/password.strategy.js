const actions = require('../../../actions')

const test = req => !req.body.password1 && !req.body.password2

const exec = req => [
  actions.prompt({
    prompt: 'New password: ',
    type: 'password',
    action: 'exec',
    line: req.body.line,
    key: 'password1',
    history: false
  })
]

module.exports = {
  sort: 100,
  test,
  exec
}
