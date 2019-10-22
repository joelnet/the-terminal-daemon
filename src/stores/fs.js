// @ts-check
const fs = require('fs-extra')
const loki = require('lokijs')
const lfsa = require('lokijs/src/loki-fs-structured-adapter')
const { withUpdatedAt } = require('./lib/withUpdatedAt')

/**
 * @callback GetStateFunction
 * @param {string} username
 */

/**
 * @callback SetStateFunction
 * @param {string} username
 * @param {function({ state: object }): void} callback
 */

/**
 * @callback UpdateStateFunction
 * @param {object} state
 */

/**
 * @typedef StateCollection
 * @type {object}
 * @property {GetStateFunction} get
 * @property {SetStateFunction} set
 * @property {UpdateStateFunction} update
 */

/**
 * @typedef Tables
 * @type {object}
 * @property {object} mail
 * @property {object} servers
 * @property {object} users
 * @property {StateCollection} state
 */

/**
 * @type {Tables}
 */
// @ts-ignore
const tables = {}

fs.ensureDirSync('./.data')

let loaded = false
let onLoadCallback

const onLoad = callback => {
  if (loaded === false) {
    onLoadCallback = callback
  } else {
    callback()
  }
}

const db = new loki('./.data/database.db', {
  adapter: new lfsa(),
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback() {
    tables.users = withUpdatedAt(
      db.getCollection('users') ||
        db.addCollection('users', { indices: ['username'] })
    )

    tables.mail = withUpdatedAt(
      db.getCollection('mail') ||
        db.addCollection('mail', { indices: ['username'] })
    )

    tables.servers = withUpdatedAt(
      db.getCollection('servers') ||
        db.addCollection('servers', { indices: ['owner', 'address'] })
    )

    const state = withUpdatedAt(
      db.getCollection('state') ||
        db.addCollection('state', { indices: ['username'] })
    )

    tables.state = {
      get: username =>
        state.find({ username: { $eq: username } })[0] ||
        state.insert({ username }),
      set: (username, callback) => {
        const data = tables.state.get(username)
        callback(data)
        state.update(data)
      },
      update: state.update
    }

    loaded = true
    if (onLoadCallback) onLoadCallback()
  }
})

module.exports = {
  tables,
  onLoad
}
