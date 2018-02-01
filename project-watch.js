const setTimeout = require('timers').setTimeout;

const fs = require('fs');
const path = require('path');
const logger = require('./log').getLogger('watch');

const config = require('./local-config');
const localRoot = config.get('Company.local');
const remoteRoot = config.get('Company.remote');
const watchFileList = config.get('Watch.projects');

const date = new Date();
const fileTag = date.toLocaleString().replace(/\:/g, '-');

const updateFileList = [];
const storageObj = {
  localRoot: localRoot,
  remoteRoot: remoteRoot,
  files: []
};

function checkAndIntoUpdateFiles (filename) {
  if (!storageObj.files.includes(filename)) {
    storageObj.files.push(filename);
  }
}

function saveToLocal () {
  setTimeout(() => {
    storageObj.files.map((file) => {
      logger.trace(`upload: ${file}`);
    });
    const date = new Date();
    fs.writeFileSync(`./logs/watch/watch-${fileTag}.json`, JSON.stringify(storageObj, null, 2), (err) => {
      logger.error(err);
    });
    fs.writeFileSync(`./logs/watch/watching.json`, JSON.stringify(storageObj, null, 2), (err) => {
      logger.error(err);
    });
    saveToLocal();
  }, 10000);
}

try {
  const rootFiles = fs.readdirSync(localRoot);
  const targetFiles = rootFiles.filter((file) => {
    return watchFileList.includes(file);
  });
  // 遍历监听
  targetFiles.map((file) => {
    const targetPath = path.join(localRoot, file);
    fs.stat(targetPath, (err, stats) => {
      if (stats.isDirectory()) {
        fs.watch(targetPath, {
          recursive: true
        }, (eventType, filename) => {
          checkAndIntoUpdateFiles(path.join(targetPath, filename));
        })
      } else if (stats.isFile()) {

      }
    });
  });
  process.nextTick(saveToLocal);
} catch (err) {
  logger.error(err);
}