import readline from 'readline'
import Blockchain from './blockchain.js' 


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const blockchain = new Blockchain();

// List of registered banks
const registeredBanks = [
    { id: 1, name: 'Bank of America' },
    { id: 2, name: 'JP Morgan Chase' },
    { id: 3, name: 'Morgan Stanley' },
    { id: 4, name: 'State Bank of India' },
    { id: 5, name: 'ICICI Bank' }
];

function mainMenu() {
    console.log("\nOptions for KYC Verification Blockchain");
    console.log("Press 0 to exit the blockchain");
    console.log("Press 1 to register user");
    console.log("Press 2 if already registered");
    console.log("Press 3 to print the blockchain");

    rl.question("Choose an option: ", (option) => {
        switch (option) {
            case '0':
                console.log("Exiting...");
                rl.close();
                break;
            case '1':
                registerUser();
                break;
            case '2':
                alreadyRegistered();
                break;
            case '3':
                printBlockchain();
                mainMenu();
                break;
            default:
                console.log("Invalid option, please try again.");
                mainMenu();
                break;
        }
    });
}
/*
function registerUser() {
    const userData = {};
    rl.question("Enter Your Name: ", (name) => {
        userData.name = name;
        rl.question("Enter your Aadhaar ID: ", (aadhaarId) => {
            userData.aadhaarId = aadhaarId;
            rl.question("Enter Your Recovery Key: ", (recoveryKey) => {
                userData.recoveryKey = recoveryKey;

                const userId = `user${Math.floor(Math.random() * 1000)}`;
                userData.uid = userId;
                console.log("Registration successful");
                console.log("Your user id is: ",userId);
                blockchain.addUser(userData);
                mainMenu();
            });
        });
    });
}
*/

function registerUser() {
    const userData = {};
    
    rl.question("Enter Your Name: ", (name) => {
        userData.name = name;
        
        const askForAadhaarId = () => {
            rl.question("Enter your Aadhaar ID (must be 12 digits): ", (aadhaarId) => {
                if (aadhaarId.length != 12 || isNaN(aadhaarId)) {
                    console.log("Invalid Aadhaar ID. Please enter exactly 12 digits.");
                    askForAadhaarId();
                } else {
                    // Check if the Aadhaar ID is already registered
                    const existingUser = blockchain.userList.list.find(user => user.aadhaarId === aadhaarId);
                    if (existingUser) {
                        console.log("Error: Aadhaar ID is already registered. Please try with a different Aadhaar ID.");
                        mainMenu(); // Return to the main menu
                        return;
                    }

                    userData.aadhaarId = aadhaarId;
                    rl.question("Enter Your Recovery Key: ", (recoveryKey) => {
                        userData.recoveryKey = recoveryKey;

                        const userId = `user${Math.floor(Math.random() * 1000)}`;
                        userData.uid = userId;
                        console.log("Registration successful");
                        console.log("Your user ID is: ", userId);
                        blockchain.addUser(userData);
                        mainMenu();
                    });
                }
            });
        };

        askForAadhaarId(); // Initial call to ask for Aadhaar ID
    });
}


function alreadyRegistered() {
    rl.question("Enter your User ID: ", (userId) => {
        // Check if the user ID exists
        const user = blockchain.userList.getUserByUid(userId);
        
        if (!user) {
            console.log("Error: User ID does not exist. Please try again.");
            mainMenu(); // Return to the main menu
            return;
        }

        console.log("\nPress 1 to view all your transactions");
        console.log("Press 2 to initiate a new transaction");
        console.log("Press 3 to update your details");

        rl.question("Choose an option: ", (option) => {
            switch (option) {
                case '1':
                    viewUserTransactions(userId);
                    break;
                case '2':
                    initiateTransaction(userId);
                    break;
                case '3':
                    updateUserDetails(userId);
                    break;
                default:
                    console.log("Invalid option, returning to main menu.");
                    mainMenu();
                    break;
            }
        });
    });
}


function viewUserTransactions(userId) {
    const transactions = blockchain.viewUser(userId);
    console.log(`Transactions for ${userId}:`);
    console.log(transactions.length ? transactions : "No transactions found.");
    mainMenu();
}

function initiateTransaction(userId) {
    console.log("\nDetails of all banks registered in Blockchain:");
    registeredBanks.forEach(bank => {
        console.log(`{ id: ${bank.id}, name: '${bank.name}' }`);
    });

    rl.question("Enter the id of the bank you are applying to for KYC Verification: ", (bankId) => {
        const selectedBank = registeredBanks.find(bank => bank.id === parseInt(bankId));

        if (selectedBank) {
            console.log(`KYC verification with ${selectedBank.name} successful!`);
            
            // Construct the transaction object
            const transaction = {
                userId,
                bank: selectedBank.name,
                type: 'KYC Verification'
            };

            blockchain.addTransaction(transaction);
            
            if (blockchain.verifyTransaction(transaction)) {
                blockchain.minePendingTransactions();
                console.log("Transaction added to the blockchain.");
            } else {
                console.error("Transaction verification failed.");
            }
        } else {
            console.log("Invalid bank ID. Please try again.");
        }
        mainMenu();
    });
}

function updateUserDetails(userId) {
    rl.question("Enter new Aadhaar ID (must be of 12 digits): ", (aadhaarId) => {
        if (aadhaarId.length != 12 || isNaN(aadhaarId)) {
            console.log("Invalid Aadhaar ID. Please enter exactly 12 digits.");
            updateUserDetails(userId);
        } else {
        rl.question("Enter new Recovery Key: ", (recoveryKey) => {
            blockchain.addTransaction({
                userId,
                aadhaarId,
                recoveryKey,
                type: 'Update'
            });
            console.log("User details updated successfully!");
            mainMenu();
        });
    }});
}

function printBlockchain() {
    console.log("\nBlockchain:");
    blockchain.chain.forEach((block, index) => {
        console.log(`Block ${index}:`, block);
    });
}

mainMenu();