// TODO: use strategy pattern, like wallet
const ansi = require('ansi-escapes')
const { allPass, range, map } = require('mojiscript')
const { getArgs, isCommand } = require('../lib/command')
const actions = require('../actions')
const { tables } = require('../stores/fs')
const { doesServerHavePackage } = require('./lib/doesServerHavePackage')

const name = 'xssh'
const UP = ansi.cursorPrevLine

const test = allPass([isCommand(name), doesServerHavePackage(name)])

const exec = req => {
  const [address] = getArgs(req.body.line)

  if (address == null) {
    return [actions.echo(`Usage: ${name} address`)]
  }

  const server =
    address !== 'home'
      ? tables.servers.find({ address: { $eq: address } })[0]
      : null

  if (server != null) {
    req.session.env.HOST = address
    req.session.env.USER = 'root'
    req.session.env.PWD = '/home/root'

    const delay = 150

    return [
      actions.historyStackPush([]),
      actions.echo(`Exploiting: ${address}`, { delay }),
      ...map(i => actions.echo(`${UP}Exploiting: ${address} ${i * 10}%`, { delay })) (range (0) (11)) // prettier-ignore
    ]
  }

  return [actions.echo(`${name}: ${address}: Could not connect`)]
}

module.exports = {
  sort: 10,
  test,
  exec,
  name
}
