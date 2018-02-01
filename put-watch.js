const fs = require('fs');
const path = require('path');
const SFTP = require('./sftp');
const config = require('./local-config');
const sftpConfg = config.get('Company.config');
const logger = require('./log').getLogger('put');

const sftp = new SFTP(sftpConfg);
sftp.init().then(() => {
  const putFile = 'watching.json';
  const data = fs.readFileSync(`./logs/watch/${putFile}`);
  const obj = JSON.parse(data);
  const { localRoot, remoteRoot, files } = obj;
  logger.trace(`${putFile} PUT from [${localRoot}] to [${remoteRoot}]`);
  console.log(`Total: ${files.length}`);
  files.map(async (file, index) => {
    const from = file;
    const _to = file.split(localRoot)[1].replace(/\\/g, '/');
    const to = path.posix.join(remoteRoot, _to);
    try {
      const result = await sftp.put(from, to);
      logger.trace(`${from} -> ${to} succeess!`);
      console.log(`${from} -> ${to} succeess!${index}`);
    } catch (err) {
      logger.trace(`${from} -> ${to} failed!`);
      console.log(`${from} -> ${to} failed!${index}`);
    }
  });
});