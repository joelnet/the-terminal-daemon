const loki = require('lokijs')
const { withUpdatedAt } = require('./lib/withUpdatedAt')

const db = new loki('memory.db')

const sessions = db.addCollection('sessions', { indices: ['id', 'updated_at'] })

module.exports = {
  sessions: withUpdatedAt(sessions)
}
