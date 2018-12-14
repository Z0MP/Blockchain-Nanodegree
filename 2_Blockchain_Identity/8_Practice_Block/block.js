/**
 * Import crypto-js/SHA256 library
 */
const SHA256 = require('crypto-js/sha256');
const CryptoJS = require('crypto-js');

/**
 * Class with a constructor for block 
 */
class Block {

	constructor(data){
		this.id = 0;
        this.nonce = 14444461234;
      	this.body = data;
      	this.hash = "";
    }
    
    /**
     * Step 1. Implement `generateHash()`
     * method that return the `self` block with the hash.
     * 
     * Create a Promise that resolve with `self` after you create 
     * the hash of the object and assigned to the hash property `self.hash = ...`
     */
  	// 
  	generateHash() {
      	// Use this to create a temporary reference of the class object
      	let self = this;
        //Implement your code here
        return new Promise(function(resolve, reject) {
            var hash = SHA256(JSON.stringify(self)).toString(CryptoJS.enc.Hex);

            if (hash == 0) {
                reject(Error("Hash returned 0"))
            }
            else if (hash.length != 64) {
                reject(Error("Hash hex length is " + hash.length + ", but expected 64 bytes for SHA256"))
            }
            else {
                self.hash = hash;
                resolve(self)
            }
        });
            
    }
}

// Exporting the class Block to be reuse in other files
module.exports.Block = Block;