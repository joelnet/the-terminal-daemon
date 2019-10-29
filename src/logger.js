const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const config = require('config')

const level = config.get('logs.level')

module.exports = createLogger({
  level,
  format: format.combine(
    format.simple(),
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  transports: [
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: `${process.cwd()}/logs/%DATE%.log`,
      maxSize: '20m',
      maxFiles: '7d',
      format: format.uncolorize()
    }),
    new transports.Console({
      level
    })
  ]
})
