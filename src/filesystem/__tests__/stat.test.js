const { Nothing, Just } = require('mojiscript')
const { onLoad } = require('../../stores/fs')
const { stat } = require('../index')

describe('filesystem/stat', () => {
  const session = {
    env: {
      HOST: 'home',
      USER: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('stat("/") returns stat', () => {
    const actual = stat({ path: '/', username: 'test', session })
    expect(actual).toMatchObject(
      Just({
        name: '/',
        type: 'd',
        fs: expect.any(Array)
      })
    )
  })

  test('stat("/bin") returns stat', () => {
    const actual = stat({ path: '/bin', username: 'test', session })
    expect(actual).toMatchObject(
      Just({
        name: 'bin',
        type: 'd',
        fs: expect.any(Array)
      })
    )
  })

  test('stat("/bin/cd") returns stat', () => {
    const actual = stat({ path: '/bin/cd', username: 'test', session })
    expect(actual).toMatchObject(
      Just({
        name: 'cd',
        type: 'f'
      })
    )
  })

  test('stat("/bin/nope") returns null', () => {
    const actual = stat({ path: '/bin/nope', username: 'test', session })
    expect(actual).toBe(Nothing)
  })

  test('stat("/home") returns stat', () => {
    const actual = stat({ path: '/home', username: 'test', session })
    expect(actual).toMatchObject(
      Just({
        name: 'home',
        type: 'd',
        fs: expect.any(Array)
      })
    )
  })

  test('stat("/home/test") returns stat', () => {
    const actual = stat({
      path: '/home/test',
      username: 'test',
      session
    })
    expect(actual).toMatchObject(
      Just({
        name: 'test',
        type: 'd',
        fs: expect.any(Array)
      })
    )
  })
})
