const Client = require('ssh2-sftp-client');

class SFTP {
  constructor(config) {
    this.sftp = new Client();
    this.config = config;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.sftp.connect(this.config);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  put(from, to) {
    return this.sftp.put(from, to);
  }
}

module.exports = SFTP;