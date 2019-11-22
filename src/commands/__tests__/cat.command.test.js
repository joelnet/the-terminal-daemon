const { exec } = require('../cat.command')
const { onLoad } = require('../../stores/fs')

describe('commands/cat', () => {
  const session = {
    env: {
      HOST: 'home',
      user: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('cat("/bin") should return: is a directory', () => {
    const directory = '/bin'
    const actual = exec({ session, body: { line: `cat ${directory}` } })[0]
    const expected = {
      type: 'ECHO',
      value: `cat: ${directory}: Is directory`
    }
    expect(actual).toMatchObject(expected)
  })

  test('cat("/x89341/ff8312") should return: No such file or directory', () => {
    const file = '/x89341/ff8312'
    const actual = exec({ session, body: { line: `cat ${file}` } })[0]
    const expected = {
      type: 'ECHO',
      value: `cat: ${file}: No such file or directory`
    }
    expect(actual).toMatchObject(expected)
  })

  test('cat("/bin/ls") should return: File cannot be output', () => {
    const file = '/bin/ls'
    const actual = exec({ session, body: { line: `cat ${file}` } })[0]
    const expected = {
      type: 'ECHO',
      value: `cat: ${file}: File cannot be output`
    }
    expect(actual).toMatchObject(expected)
  })
})
