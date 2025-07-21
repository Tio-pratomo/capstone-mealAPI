import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp('DD-MM-YYYY HH-mm-ss'),
    winston.format.printf(
      (info) =>
        `${info.timestamp} ${info.level.toUpperCase()} : ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(
      winston.format.colorize(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} ${info.level.toUpperCase()} : ${info.message}`,
      ),
    ),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

export { logger };
