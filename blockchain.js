import Block from './block.js'
import UserList from './userList.js';
import calculateHash from './hash.js'

class Blockchain {
    constructor() {
        this.chain = [this.createBlock()];  // Initializes the blockchain with a genesis block (the first block in the chain).
        this.difficulty = 2; // sets the difficulty level = 2
        this.pendingTransactions = [];  // An array to hold transactions that are yet to be included in a block.
        this.userList = new UserList();
    }

    createBlock() {  // this method creates the first block (genesis block) in the blockchain.
        return new Block(0, "0", Date.now(), []); // (index, prevhash, timestamp, transaction)
    }

    getLatestBlock() {  // This method retrieves the most recently added block in the chain, useful for linking new blocks to the existing chain.
        const latestIdx = this.chain.length - 1;
        return this.chain[latestIdx];
    }

    addTransaction(transaction) {
        // Directly push the transaction to pendingTransactions
        this.pendingTransactions.push(transaction);
    }    

    minePendingTransactions() {  // this method creates a new block to store the pending transactions.
        let block = new Block(this.chain.length, this.getLatestBlock().hash, Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        this.chain.push(block);
        this.pendingTransactions = [];
    }

    generatePublicHash(uid) {
        const privateHash = this.userList.uidPrivateHashMap.get(uid);
        let recoveryKey;

        // Find the recoveryKey for the user with the given uid
        const user = this.userList.getUserByUid(uid);
        if (user) {
            recoveryKey = user.recoveryKey;
        }

        if (!privateHash || !recoveryKey) {
            console.error("Missing private hash or recovery key for the user.");
            return null;
        }

        // Generate public hash by hashing privateHash + recoveryKey iteratively
        let hashData = privateHash + recoveryKey;
        let publicHash = calculateHash(hashData);

        for (let i = 0; i < 5; i++) {
            hashData = publicHash + recoveryKey;
            publicHash = calculateHash(hashData);
        }

        return publicHash;
    }

    addUser(userData) {
        this.userList.addUser(userData);
    }

    verifyTransaction(transaction) {
        const transactionHash = calculateHash(transaction);
        let KYCVerified = false;

        const p = 11;  // Prime number
        const g = 2;   // Generator for prime p
        
        // Assume x is the user's Aadhaar ID for simplicity in this example
        // Assume x is the user's Aadhaar ID for simplicity in this example
        const user = this.userList.getUserByUid(transaction.userId);
        if (!user) {
            console.error("User not found for ZKP verification.");
            return false;
        }

        const x = parseInt(user.aadhaarId, 10);  // Sensitive data
        const y = Math.pow(g, x) % p;  // Public key equivalent

        // ZKP Steps
        // Step 1: Alice (prover) chooses random r and computes h
        const r = Math.floor(Math.random() * (p - 1));  // Random number r
        const h = Math.pow(g, r) % p;

        // Step 2: Bob (verifier) sends a random bit (0 or 1)
        const b = Math.floor(Math.random() * 2);  // Random bit (0 or 1)

        // Step 3: Alice sends s = (r + bx) % (p - 1) to Bob
        const s = (r + b * x) % (p - 1);

        // Step 4: Bob checks if g^s mod p == h * y^b mod p
        const leftSide = Math.pow(g, s) % p;
        const rightSide = (h * Math.pow(y, b)) % p;

        // Verification
        if (leftSide === rightSide) {
            console.log("ZKP verification successful for transaction!");
            KYCVerified = true;
        } else {
            console.error("ZKP verification failed for transaction.");
        }

        return KYCVerified;
    }
    
    viewUser(userId) {// this method retrieves all transactions related to a specific user
        return this.chain.flatMap(block => block.transactions).filter(transaction => transaction.userId === userId);
    }
}

export default Blockchain;