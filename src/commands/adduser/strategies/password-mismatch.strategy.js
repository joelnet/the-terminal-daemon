const actions = require('../../../actions')

const test = req =>
  req.body.password2 && req.body.password2 !== req.body.state.password1

const exec = () => [actions.echo('Sorry, passwords do not match.')]

module.exports = {
  sort: 30,
  test,
  exec
}
