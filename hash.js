// In this file, we define the calculateHash function that computes the SHA-256 hash and then export it.
import crypto from 'crypto'  // Node.js's built-in crypto module, which provides SHA-256 hashing algorithm. It helps create secure, irreversible hash values for data.

function calculateHash(index, previousHash, timestamp, transactions, nonce){
    const cryptoHash = crypto.createHash('sha256')
        .update(index + previousHash + timestamp + JSON.stringify(transactions) + nonce)
        .digest('hex'); // Encoding to be used

    //console.log(cryptoHash);
    return cryptoHash;
}

export default calculateHash;

//index: The position of the block in the blockchain.
//previousHash: The hash of the previous block, ensuring the chain’s continuity and integrity.
//timestamp: The time when the block is created, which makes each block unique.
//transactions: The data associated with this block, such as transactions, which is stringified to be included in the hash calculation.

// Purpose of hash.js in the Blockchain Context
// In a blockchain, each block’s hash is based on its data and the previous block’s hash, 
// forming a continuous chain. If any data in a block is altered, the hash changes, 
// breaking the chain's integrity. 
// By using SHA-256, we ensure that even a tiny change in the block’s data results 
// in a completely different hash, securing the blockchain from tampering.