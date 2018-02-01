const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
log4js.configure({
  appenders: {
    err: {
      type: 'dateFile',
      filename: 'logs/err-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    watch: {
      type: 'dateFile',
      filename: 'logs/project-watch-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    sync: {
      type: 'dateFile',
      filename: 'logs/project-sync-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    put: {
      type: 'dateFile',
      filename: 'logs/put-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['err'],
      level: 'debug'
    },
    watch: {
      appenders: ['watch'],
      level: 'trace'
    },
    sync: {
      appenders: ['sync'],
      level: 'trace'
    },
    put: {
      appenders: ['put'],
      level: 'trace'
    }
  }
});

fs.open(path.join(__dirname, 'logs', 'watch'), 'r', (err) => {
  if (err) {
    fs.mkdirSync(path.join(__dirname, 'logs', 'watch'));
  }
});

module.exports = log4js;