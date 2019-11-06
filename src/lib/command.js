const { parse } = require('shell-quote')

/**
 * Parses the command from a string
 * @param {string} line Line to parse for command
 * @returns {string} Command taken from string
 */
const getCommand = (line = '') => parse(line)[0] || ''

/**
 * Parses the args from a string
 * @param {string} line Line to parse for args
 * @returns {Array<string>} Args taken from string
 */
const getArgs = line => parse(line).slice(1)

/**
 * Tests the request body for the command
 * @param {string} command Command to test for
 * @returns {function({ req: { body: { line: 'string' }} }): boolean}
 */
const isCommand = command => req => getCommand(req.body.line) === command

module.exports = {
  parse,
  getCommand,
  getArgs,
  isCommand
}
