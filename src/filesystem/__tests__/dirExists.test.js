const { dirExists } = require('../dirExists')
const { onLoad } = require('../../stores/fs')

describe('filesystem/dirExists', () => {
  const session = {
    env: {
      HOST: 'home',
      USER: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('dirExists("/") returns true', () => {
    const actual = dirExists({ dir: '/', username: 'test', session })
    expect(actual).toBe(true)
  })

  test('dirExists("/bin") returns true', () => {
    const actual = dirExists({ dir: '/bin', username: 'test', session })
    expect(actual).toBe(true)
  })

  test('dirExists("/bin/cd") returns false', () => {
    const actual = dirExists({ dir: '/bin/cd', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('dirExists("/bin/nope") returns false', () => {
    const actual = dirExists({ dir: '/bin/nope', username: 'test', session })
    expect(actual).toBe(false)
  })

  test('dirExists("/home") returns true', () => {
    const actual = dirExists({ dir: '/home', username: 'test', session })
    expect(actual).toBe(true)
  })

  test('dirExists("/home/test") returns true', () => {
    const actual = dirExists({
      dir: '/home/test',
      username: 'test',
      session
    })
    expect(actual).toBe(true)
  })
})
