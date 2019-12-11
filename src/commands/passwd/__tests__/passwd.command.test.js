const { exec } = require('../passwd.command')

// TODO: this function dangerously updates the users session.
describe.skip('commands/passwd', () => {
  const session = {
    env: {
      HOST: 'home',
      user: 'test'
    }
  }

  // TODO: this function dangerously updates the users session.
  // test('passwd should be within /bin dir', () => {
  //   const expected = { name: 'passwd', type: 'f' }
  //   const actual = ls({ path: '/bin', username: 'test', session }).value.find(
  //     file => file.name === 'passwd'
  //   )
  //   expect(actual).toMatchObject(expected)
  // })

  test('passwd, first input should return a Prompt', async () => {
    const [actual] = await exec({ session, body: { line: 'passwd' } })
    const expected = { type: 'PROMPT' }
    expect(actual).toMatchObject(expected)
  })

  test('passwd, second input should return a Prompt', async () => {
    const newPassword = 'foo'
    const [actual] = await exec({
      session,
      body: { line: 'passwd', password1: newPassword }
    })
    const expected = { type: 'PROMPT' }
    expect(actual).toMatchObject(expected)
  })

  test('passwd, second password does not equal first password', async () => {
    const newPassword = 'foo'
    const [actual] = await exec({
      session,
      body: {
        line: 'passwd',
        state: { password1: newPassword },
        password2: 'faoex'
      }
    })
    const expected = { type: 'ECHO', value: 'Sorry, passwords do not match.' }
    expect(actual).toMatchObject(expected)
  })

  // TODO: this function dangerously updates the users session.
  // test('passwd, successful change', async () => {
  //   const initialHash = 'somehash'
  //   const newPassword = 'foo'
  //   tables.users.insert({ user: session.env.user, hash: initialHash })

  //   const [actual] = await exec({
  //     session,
  //     body: {
  //       line: 'passwd',
  //       state: { password1: newPassword },
  //       password2: newPassword
  //     }
  //   })
  //   const expected = { type: 'ECHO', value: 'Password has been changed' }
  //   expect(actual).toMatchObject(expected)
  //   const [updatedUser] = tables.users.find(
  //     user => user.user === session.env.user
  //   )
  //   expect(updatedUser.hash).not.toMatch(initialHash)
  // })
})
