/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {
    constructor() {
        this.db = level(chainDB);
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err) {
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    } else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });
        });
    }

    // Method that return the height (Promise)
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject) {
            let count = 0;
            self.db.createReadStream()
                .on('data', function(data) {
                    count++;
                })
                .on('error', function(err) {
                    console.log('createReadStream error: ', err);
                    reject(err);
                })
                .on('close', function() {
                    resolve(count - 1); // subtract genesis block
                });
        });
    }

    getAllBlocks() {
        let self = this;
        let dataArray = [];
        return new Promise(function(resolve, reject) {
            self.db.createReadStream()
                .on('data', function(data) {
                    dataArray.push(JSON.parse(data.value));
                })
                .on('error', function(err) {
                    console.log('createReadStream error: ', err);
                    reject(err);
                })
                .on('close', function() {
                    resolve(dataArray);
                });
        });
    }
}

// Export the class
module.exports.LevelSandbox = LevelSandbox;