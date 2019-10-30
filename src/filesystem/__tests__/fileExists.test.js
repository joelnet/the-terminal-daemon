const { onLoad } = require('../../stores/fs')
const { fileExists } = require('../fileExists')

describe('filesystem/fileExists', () => {
  const session = {
    env: {
      HOST: 'home',
      user: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('fileExists("/") returns false', () => {
    const actual = fileExists({ dir: '/', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('fileExists("/bin") returns false', () => {
    const actual = fileExists({ dir: '/bin', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('fileExists("/bin/ls") returns true', () => {
    const actual = fileExists({ dir: '/bin/ls', username: 'test', session })
    expect(actual).toBe(true)
  })

  test('fileExists("/bin/nope") returns false', () => {
    const actual = fileExists({ dir: '/bin/nope', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('fileExists("/home") returns false', () => {
    const actual = fileExists({ dir: '/home', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('fileExists("/home/testuser") returns false', () => {
    const actual = fileExists({
      dir: '/home/testuser',
      username: 'testuser',
      session
    })
    expect(actual).toBe(false)
  })
})
