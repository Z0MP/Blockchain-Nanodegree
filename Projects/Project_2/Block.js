/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
    constructor(data){
        this.previousBlockHash = '';
        this.hash = '';
        this.height = 0;
        this.timeStamp = new Date().getTime().toString().slice(0, -3);
        this.data = data;
    }
}

module.exports.Block = Block;