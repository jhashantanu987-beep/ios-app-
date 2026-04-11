/**
 * Logger Utility
 * Simple logging with different levels
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

const logLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SUCCESS: 'SUCCESS',
};

const formatTime = () => {
  return new Date().toISOString();
};

const log = (level, message, data = null) => {
  const timestamp = formatTime();
  const colorCode = {
    ERROR: colors.red,
    WARN: colors.yellow,
    INFO: colors.blue,
    DEBUG: colors.gray,
    SUCCESS: colors.green,
  }[level];

  const prefix = `${colorCode}[${timestamp}] ${level}${colors.reset}`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

module.exports = {
  error: (message, data) => log(logLevel.ERROR, message, data),
  warn: (message, data) => log(logLevel.WARN, message, data),
  info: (message, data) => log(logLevel.INFO, message, data),
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      log(logLevel.DEBUG, message, data);
    }
  },
  success: (message, data) => log(logLevel.SUCCESS, message, data),
};
