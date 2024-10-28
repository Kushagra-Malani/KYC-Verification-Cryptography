import calculateHash from './hash.js'

class UserList {
    constructor() {
        this.list = []; // Array of users
        this.uidPrivateHashMap = new Map(); // Map of uid to privateHash
    }

    // Add a user to the list and hash map
    addUser(user) {
        this.list.push(user);
        this.uidPrivateHashMap.set(user.uid, calculateHash(user.aadhaarId + user.recoveryKey));
    }

    // Retrieve a user by uid
    getUserByUid(uid) {
        return this.list.find(user => user.uid === uid);
    }
}

export default UserList;