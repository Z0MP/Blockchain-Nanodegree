/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {
    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    generateGenesisBlock(){
        this.getBlockHeight().then((height) => {
            if (height === -1) {
                let genesisBlock = new Block.Block("Genesis block");
                this.addNewBlock(genesisBlock).then((block) => {
                    console.log(block);
                });
            }
        }).catch((err) => { console.log(err); });
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.getBlocksCount().then((height) => {
                resolve(height);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    // Add new block
    addNewBlock(block) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Set Block Height
            self.getBlockHeight().then(function(height) {
                block.height = height + 1;
                return self.db.getLevelDBData(height);
            }).then((prevBlockDB) => {
                if (prevBlockDB) {
                    let prevBlock = JSON.parse(prevBlockDB);
                    block.previousBlockHash = prevBlock.hash;
                    block.hash = SHA256(JSON.stringify(block)).toString();
                } else {
                    block.hash = SHA256(JSON.stringify(block)).toString();
                }

                return self.db.addLevelDBData(block.height, JSON.stringify(block).toString());
            }).then((result) => {
                if (!result) {
                    console.log("Error adding new block to the blockchain");
                    reject(new TypeError("Error adding new block to the blockchain"));
                }
                resolve(result);
            }).catch((err) => {console.log(err); reject(err);});
        });
    }

    // Get Block By Height
    getBlock(height) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.getLevelDBData(height).then((blockDB) => {
                if(blockDB) {
                    resolve(JSON.parse(blockDB));
                } else {
                    throw new Error(`Block does not exist for height: ${height}`);
                }
            }).catch((err) => {
                console.log("REJECTING");
                reject(err);
            });
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getBlock(height).then((block) => {
                const blockHash = block.hash;
                block.hash = ""; //remove hash because re-hashing the block will be different if we don't
                const validatedBlockHash = SHA256(JSON.stringify(block)).toString();
                if (validatedBlockHash === blockHash) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => { reject(err); });
        });
    }

    // Validate Blockchain
    validateChain() {
        let self = this;
        let errorLog = [];

        return new Promise(function(resolve, reject) {
            self.db.getAllBlocks().then((blockchain) => {
                let validatePromises = [];

                // Sort blockchain by height integer. Default lexicographic LevelDB sorting is not desired
                blockchain.sort(function(a,b) {
                    return a.height - b.height;
                });

                blockchain.forEach((block) => {
                    validatePromises.push(self.validateBlock(block.height));
                    if(block.height > 0) {
                        let prevBlockHash = block.previousBlockHash;
                        let blockHash = blockchain[block.height - 1].hash;
                        if (blockHash != prevBlockHash) {
                            errorLog.push(`Error! Block Height: ${block.height} Previous Hash doesn't match`);
                        }
                    }
                });

                Promise.all(validatePromises).then((validatePromiseResults) => {
                    let chainIndex = 0;
                    validatePromiseResults.forEach((valid) => {
                        if(!valid) {
                            errorLog.push(`Error! Block Height: ${blockchain[chainIndex].height} has been TAMPERED`);
                        }
                        chainIndex++;
                    });
                    resolve(errorLog);
                }).catch((err) => { console.log(err); reject(err); });
            }).catch((err) => { console.log(err); reject(err); });
        });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;