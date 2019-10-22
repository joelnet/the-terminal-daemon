const bcrypt = require('bcryptjs')

const createHash = password => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

module.exports = {
  createHash,
  validatePassword: bcrypt.compareSync
}
