const { fileExists } = require('../../filesystem')

/**
 * Checks a Server to see if a Package is installed
 * @param {string} name Name of package
 * @returns {function({ req: { body: { line: 'string' }} }): boolean}
 */
const doesServerHavePackage = name => req =>
  fileExists({
    dir: `/bin/${name}`,
    username: req.session.username,
    session: req.session
  })

module.exports = {
  doesServerHavePackage
}
