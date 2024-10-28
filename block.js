// In this file, you import the calculateHash function from hash.js and use it in the Block class.
// We define a 'Block' which is a class that represents an individual block in a blockchain
import calculateHash from "./hash.js";
// The calculateHast function is used to calculate a SHA-256 hash based on the block’s data.
class Block {
    constructor(index, previousHash, timestamp, transactions, nonce = 0) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = this.calculateHash(); // computing the initial hash based on the above parameters.
    }

    calculateHash() {  // This method is used for recalculating the hash whenever a block’s data changes
        return calculateHash(this.index, this.previousHash, this.timestamp, this.transactions, this.nonce);
    }

    mineBlock(difficulty) { // This method performs the mining process, which is how blocks are added to the blockchain in a secure manner.
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        //console.log(`Block mined: ${this.hash}`);
    }
}

export default Block;