const { Nothing, Just } = require('mojiscript')
const { onLoad } = require('../../stores/fs')
const { ls } = require('../ls')
const { files } = require('../files')
const { getHomeDirectory } = require('../getHomeDirectory')

describe('filesystem/ls', () => {
  const session = {
    env: {
      HOST: 'home',
      USER: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('ls("/") returns dir', () => {
    const expected = Just(files)
    const actual = ls({ path: '/', username: 'test', session })
    expect(actual).toMatchObject(expected)
  })

  test('ls("/bin") returns dir', () => {
    const expected = Just(files.find(({ name }) => name === 'bin').fs)
    const actual = ls({ path: '/bin', username: 'test', session })
    expect(actual).toMatchObject(expected)
  })

  test('ls("/bin/cd") returns Nothing', () => {
    const expected = Nothing
    const actual = ls({ path: '/bin/cd', username: 'test', session })
    expect(actual).toMatchObject(expected)
  })

  test('ls("/bin/nope") returns null', () => {
    const expected = Nothing
    const actual = ls({ path: '/bin/nope', username: 'test', session })
    expect(actual).toBe(expected)
  })

  test('ls("/home") returns ls', () => {
    const expected = Just(getHomeDirectory('test', 'home'))
    const actual = ls({ path: '/home', username: 'test', session })
    expect(actual).toMatchObject(expected)
  })

  test('ls("/home/test") returns ls', () => {
    const expected = Just(getHomeDirectory('test', 'home')[0].fs)
    const actual = ls({ path: '/home/test', username: 'test', session })
    expect(actual).toMatchObject(expected)
  })

  test('ls("/home/test/servers") returns Nothing', () => {
    const expected = Nothing
    const actual = ls({
      path: '/home/test/servers',
      username: 'test',
      session
    })
    expect(actual).toMatchObject(expected)
  })
})
