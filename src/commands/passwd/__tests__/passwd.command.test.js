const { exec } = require('../passwd.command')
const { onLoad, tables } = require('../../../stores/fs')
const { ls } = require('../../../filesystem/ls')

describe('commands/passwd', () => {
  const session = {
    env: {
      HOST: 'home',
      user: 'test'
    }
  }

  beforeAll(async () => {
    await new Promise(onLoad)
  })

  test('passwd should be within /bin dir', () => {
    const expected = { name: 'passwd', type: 'f' }
    const actual = ls({ path: '/bin', username: 'test', session }).value.find(
      file => file.name === 'passwd'
    )
    expect(actual).toMatchObject(expected)
  })

  test('passwd, first input should return a Prompt', () => {
    const actual = exec({ session, body: { line: 'passwd' } })[0]
    const expected = { type: 'PROMPT' }
    expect(actual).toMatchObject(expected)
  })

  test('passwd, second input should return a Prompt', () => {
    const newPassword = 'foo'
    exec({ session, body: { line: 'passwd' } })[0]
    const actual = exec({
      session,
      body: { line: 'passwd', password1: newPassword }
    })[0]
    const expected = { type: 'PROMPT' }
    expect(actual).toMatchObject(expected)
  })

  test('passwd, second password does not equal first password', () => {
    const newPassword = 'foo'
    exec({ session, body: { line: 'passwd' } })[0]
    exec({ session, body: { line: 'passwd', password1: newPassword } })[0]
    const actual = exec({
      session,
      body: {
        line: 'passwd',
        state: { password1: newPassword },
        password2: 'faoex'
      }
    })[0]
    const expected = { type: 'ECHO', value: 'Sorry, passwords do not match.' }
    expect(actual).toMatchObject(expected)
  })

  test('passwd, successful change', () => {
    const initialHash = 'somehash'
    const newPassword = 'foo'
    tables.users.insert({ user: session.env.user, hash: initialHash })
    exec({ session, body: { line: 'passwd' } })[0]
    exec({ session, body: { line: 'passwd', password1: newPassword } })[0]
    const actual = exec({
      session,
      body: {
        line: 'passwd',
        state: { password1: newPassword },
        password2: newPassword
      }
    })[0]
    const expected = { type: 'ECHO', value: 'Password has been changed' }
    expect(actual).toMatchObject(expected)
    const updatedUser = tables.users.find(
      user => user.user === session.env.user
    )[0]
    expect(updatedUser.hash).not.toMatch(initialHash)
  })
})
