const setTimeout = require('timers').setTimeout;

const fs = require('fs');
const path = require('path');
const SFTP = require('./sftp');
const logger = require('./log').getLogger('sync');

const config = require('./local-config');
const localRoot = config.get('Company.local');
const remoteRoot = config.get('Company.remote');
const sftpConfg = config.get('Company.config');
const watchFileList = config.get('Watch.projects');

const sftp = new SFTP(sftpConfg);
const updateFileList = [];

function checkAndIntoUpdateFileList(filename) {
  if (!updateFileList.includes(filename)) {
    updateFileList.push(filename);
  }
}

function uploadToTestServer() {
  setTimeout(() => {
    updateFileList.map(async (file) => {
      const from = file;
      const _to = file.split(localRoot)[1].replace(/\\/g, '/');
      const to = path.posix.join(remoteRoot, _to);
      try {
        const result = await sftp.put(from, to);
        logger.trace(`${from} -> ${to} succeess!`);
        console.log(`${from} -> ${to} succeess!`);
      } catch (err) {
        logger.trace(`${from} -> ${to} failed!`);
        console.log(`${from} -> ${to} failed!`);
      }
    });
    updateFileList.splice(0, updateFileList.length);
    uploadToTestServer();
  }, 5000);
}

sftp.init().then(() => {
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
            checkAndIntoUpdateFileList(path.join(targetPath, filename));
          })
        } else if (stats.isFile()) {

        }
      });
    });
    process.nextTick(uploadToTestServer);
  } catch (err) {
    console.error(`chdir: ${err}`);
  }
});