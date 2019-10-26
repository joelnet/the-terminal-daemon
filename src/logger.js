const { createLogger, format, transports } = require('winston')
                          require('winston-daily-rotate-file')
const config = require('config')

module.exports = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  transports: [
    new transports.DailyRotateFile({
      name: 'file',
      datePattern: '.yyyy-MM-dd',
      filename:  `${__dirname}/../logs/log_file.log`,
      maxSize: '20m',
      maxFiles: '7d'
    }),
    new transports.Console({
      level: config.get('logs.level'),
    })
  ]
})