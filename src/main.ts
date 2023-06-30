const {Blockchain, Transaction} = require("./blockchain");
const wallets = require("../wallets.json");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");


//my private key
const myPrivateKey = ec.keyFromPrivate(
  "74e28fbe687f76cc750c27ac3f7240caf6b62484c99e203e3f1d5f915354e563"
);

//from private key, we can calculate public key which is my wallet address
const myWalletAddress = myPrivateKey.getPublic('hex');

// instantiating a blockchain
let dummycoin = new Blockchain();

// Mine Block 1 to get some coins to my address even though there are no transactions
dummycoin.minePendingTransactions(myWalletAddress);
console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

// Creating a transaction and signing it with my private key
const tx1 = new Transaction(myWalletAddress, wallets.friend1.publicKey, 8);
tx1.signTransaction(myPrivateKey);
dummycoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress, wallets.friend2.publicKey, 10);
tx2.signTransaction(myPrivateKey);
dummycoin.addTransaction(tx2);

const tx3 = new Transaction(myWalletAddress, wallets.friend3.publicKey, 20);
tx3.signTransaction(myPrivateKey);
dummycoin.addTransaction(tx3);

//Mining the Block
dummycoin.minePendingTransactions(myWalletAddress);

console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

const tx4 = new Transaction(myWalletAddress, wallets.friend2.publicKey, 13);
tx4.signTransaction(myPrivateKey);
dummycoin.addTransaction(tx4);

//Mining the Block
dummycoin.minePendingTransactions(myWalletAddress);

console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

//checking validity of entire chain
console.log(`\nIs Chain valid?`, dummycoin.isChainValid?"YES":"NO");

