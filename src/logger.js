const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const config = require('config')

const level = config.get('logs.level')

module.exports = createLogger({
  level,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  transports: [
    new transports.DailyRotateFile({
      name: 'file',
      datePattern: '.yyyy-MM-dd',
      filename: `${process.cwd()}/logs/log_file.log`,
      maxSize: '20m',
      maxFiles: '7d'
    }),
    new transports.Console({ level })
  ]
})
