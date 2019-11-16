const { exec } = require('../clear.command')
const actions = require('../../actions')

describe('commands/clear', () => {
  test('execution of the command returns an array', () => {
    const actual = exec()
    expect(actual).toStrictEqual([actions.echo('\u001b[2J\u001b[0;0H', { crlf: false })])
  })
})
