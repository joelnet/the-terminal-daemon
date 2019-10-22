const chalk = require('chalk')

const chalkTemplate = template => {
  const chalked = [template]
  chalked.raw = chalked
  return chalk(chalked)
}

module.exports = {
  chalkTemplate
}
