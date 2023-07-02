const {Blockchain, Transaction} = require("./blockchain");
const keyGen = require("../keyGenerator.js");
const friends = require("../dummyKeys.json");

//my private key
const myPvtKey = "74e28fbe687f76cc750c27ac3f7240caf6b62484c99e203e3f1d5f915354e563";
const myPubKey = keyGen.getPubKeyFromPvtKey(myPvtKey);
const myWalletAddress = keyGen.getWalletFromPvtKey(myPvtKey);

// instantiating a blockchain
let dummycoin = new Blockchain();

// Mine Block 1 to get some coins to my address even though there are no transactions
dummycoin.minePendingTransactions(myWalletAddress);
console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

// Creating a transaction and signing it with my private key
const tx1 = new Transaction(myWalletAddress, friends[0].wallet, 8);
tx1.signTransaction(myPvtKey);
dummycoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress, friends[1].wallet, 10);
tx2.signTransaction(myPvtKey);
dummycoin.addTransaction(tx2);

const tx3 = new Transaction(myWalletAddress, friends[2].wallet, 20);
tx3.signTransaction(myPvtKey);
dummycoin.addTransaction(tx3);

//Mining the Block
dummycoin.minePendingTransactions(myWalletAddress);

console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

const tx4 = new Transaction(myWalletAddress, friends[1].wallet, 13);
tx4.signTransaction(myPvtKey);
dummycoin.addTransaction(tx4);

//Mining the Block
dummycoin.minePendingTransactions(myWalletAddress);

console.log(`\nBalance of sushruta19 : ${dummycoin.getBalanceOfAddress(myWalletAddress)}`);

//checking validity of entire chain
console.log(`\nIs Chain valid?`, dummycoin.isChainValid?"YES":"NO");


