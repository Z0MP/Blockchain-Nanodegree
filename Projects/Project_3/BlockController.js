const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require('./BlockChain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockChain = new BlockChainClass.Blockchain();
        this.blocks = [];
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res, next) => {
            let height = req.params.index;
            this.blockChain.getBlock(height).then((block) => {
                res.send(block);
                console.log(`GET success:\n${JSON.stringify(block)}\n`);
            }).catch(next);
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res, next) => {
            if (!req.body.body) return res.sendStatus(400);

            let newBlock = new BlockClass.Block(req.body.body);
            this.blockChain.addNewBlock(newBlock).then((block) => {
                console.log(`POST success:\n${block}\n`);
                res.send(block);
            }).catch(next);
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}