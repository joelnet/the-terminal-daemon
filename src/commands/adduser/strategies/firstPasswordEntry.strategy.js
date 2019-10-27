const actions = require('../../../actions')

const test = () => true

const exec = req => {
  return [
    actions.prompt({
      prompt: 'New password: ',
      type: 'password',
      action: 'exec',
      line: req.body.line,
      key: 'password1',
      history: false
    })
  ]
}

module.exports = {
  exec,
  sort: 1,
  test
}
