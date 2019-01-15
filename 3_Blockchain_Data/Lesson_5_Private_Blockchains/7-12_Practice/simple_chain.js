/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/
const SHA256 = require('crypto-js/sha256');

/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/
class Block {
    constructor(data){
        this.previousHash = '0x';
        this.hash = '';
        this.height = '';
        this.timeStamp = '';
        this.data = data;
    }
}

/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/
class Blockchain {
    constructor() {
        // new chain array
        this.chain = [];
        // add first genesis block
        this.addBlock(this.createGenesisBlock());
    }

    createGenesisBlock() {
        return new Block("First block in the chain - Genesis block");
    }

    addBlock(newBlock) {
        // Set Block Height
        newBlock.height = this.chain.length;
        // Set UTC Timestamp
        newBlock.timeStamp = new Date().getTime().toString().slice(0,-3);

        // Set Previous Block Hash
        if (this.chain.length > 0) {
            newBlock.previousHash = this.chain[this.chain.length - 1].hash;
        }

        // SHA256 requires a string of data
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // add block to chain
        this.chain.push(newBlock);
    }
}
