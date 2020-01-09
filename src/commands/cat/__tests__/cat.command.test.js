const { exec } = require('../cat.command')
const { onLoad } = require('../../../stores/fs')

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



  test('cat("/bin") should return: is a directory', async () => {
    const directory = '/bin'
    const [actual] = await exec({ session, body: { line: `cat ${directory}` } })
    const expected = {
      type: 'ECHO',
      value: `cat: ${directory}: Is directory`
    }
    expect(actual).toMatchObject(expected)
  })
  
  test('cat("/x89341/ff8312") should return: No such file or directory', async () => {
    const file = '/x89341/ff8312'
    const [actual] = await exec({ session, body: { line: `cat ${file}` } })
    const expected = {
      type: 'ECHO',
      value: `cat: ${file}: No such file or directory`
    }
    expect(actual).toMatchObject(expected)
  })


  test('cat("/bin/ls") should return: File cannot be output', async () => {
    const file = '/bin/ls'
    const [actual] = await exec({ session, body: { line: `cat ${file}` } })
    const expected = {
      type: 'ECHO',
      value: `cat: ${file}: File cannot be output`
    }
    expect(actual).toMatchObject(expected)
  })
})
