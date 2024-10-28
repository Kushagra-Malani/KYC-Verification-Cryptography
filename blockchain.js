import Block from './block.js'
import UserList from './userList.js';
import calculateHash from './hash.js'

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];  // Initializes the blockchain with a genesis block (the first block in the chain).
        this.difficulty = 2; // sets the difficulty level = 2
        this.pendingTransactions = [];  // An array to hold transactions that are yet to be included in a block.
        this.userList = new UserList();
    }

    createGenesisBlock() {  // this method creates the first block (genesis block) in the blockchain.
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
        // Use the same hash function to generate the hash for verification
        const transactionHash = calculateHash(transaction);
        //console.log("test1 (userId):", transaction.userId);
        //console.log("test2 (transactionHash):", transactionHash);
    
        let KYCVerified = false;
    
        // Check within pendingTransactions to see if it matches
        for (const pendingTransaction of this.pendingTransactions) {
            if (calculateHash(pendingTransaction) === transactionHash) {
                KYCVerified = true;
                break;
            }
        }
    
        if (KYCVerified) {
            console.log("KYC verification successful!");
            return true;
        } else {
            console.error("KYC Verification unsuccessful, please manually verify your KYC.");
            return false;
        }
    }      
    
    viewUser(userId) {// this method retrieves all transactions related to a specific user
        return this.chain.flatMap(block => block.transactions).filter(transaction => transaction.userId === userId);
    }
}

export default Blockchain;