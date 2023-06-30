const { SHA256 } = require("crypto-js")

class Transaction {
  fromAddress : string;
  toAddress : string;
  amount : number;

  constructor(fromAddress : string, toAddress : string, amount : number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;           
  }
}

class Block {
  private timestamp : number;
  private transactions : Transaction[];
  public previousHash : string;
  public hash : string;
  public nonce : number;

  constructor(timestamp:number, transactions:Transaction[], previousHash:string='') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() : string {
    return SHA256(
      this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
    ).toString();
  }

  mineBlock(difficulty : number) : void {
    while(this.hash.substring(0, difficulty) !== Array(difficulty).fill("0").join("")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block Mined: " + this.hash);
  }

  getTransactionsData() : Transaction[] {
    return this.transactions;
  }
}

class Blockchain {
  private chain : Block[];
  private difficulty : number;
  private pendingTransactions : Transaction[];
  private miningReward : number;
  private lastDifficultyAdjustmentBlock : number;

  constructor() {
    this.difficulty = 3;
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 50;
    this.lastDifficultyAdjustmentBlock = 0;
  }

  private createGenesisBlock() : Block {
    let genesisBlock : Block = new Block(Date.now(), [{fromAddress:"null", toAddress:"null", amount:0}], "0");
    console.log("Mining Genesis Block...");
    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  private getDifficulty() : number {
    const blocksPerDifficultyAdjustment = 10;
    if(this.chain.length - this.lastDifficultyAdjustmentBlock >= blocksPerDifficultyAdjustment) {
      this.difficulty ++;
      this.lastDifficultyAdjustmentBlock = this.chain.length;
    }
    return this.difficulty;
  }

  public minePendingTransactions(miningRewardAddress : string) : void {
    const rewardTransaction : Transaction = new Transaction(
      "null", miningRewardAddress, this.miningReward);

    this.pendingTransactions.push(rewardTransaction);

    let newBlock : Block = new Block(
      Date.now(), this.pendingTransactions, this.chain[this.chain.length-1].hash
    ); 

    newBlock.mineBlock(this.getDifficulty());
    this.chain.push(newBlock);

    this.pendingTransactions = [];
  }

  public createTransaction(transaction : Transaction) : void {
    this.pendingTransactions.push(transaction);
  }

  public getBalanceAddress(walletAddress : string) : number{
    let balance = 0;
    
    for(let i = 0; i<this.chain.length; i++) {
      const transactionList = this.chain[i].getTransactionsData();
      for(let j = 0; j<transactionList.length; j++) {
        const unitTransaction = transactionList[j];
        if(unitTransaction.fromAddress === walletAddress) {
          balance -= unitTransaction.amount;
        }
        if(unitTransaction.toAddress === walletAddress) {
          balance += unitTransaction.amount;
        }
      }
    }
    return balance;
  }

  public getLatestBlock() : Block {
    return this.chain[this.chain.length-1];
  }
  
  public isChainValid() : boolean {
    let previousBlock : Block = this.chain[0];

    if(previousBlock.hash !== previousBlock.calculateHash()) {
      return false;
    }

    for(let i=1; i<this.chain.length; i++) {
      let currentBlock :Block = this.chain[i];
      
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      previousBlock = currentBlock; 
    }
    return true;
  }

}

// instantiating a blockchain
let dummycoin = new Blockchain();

dummycoin.createTransaction(new Transaction("address1", "address2", 100));
dummycoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
dummycoin.minePendingTransactions("address3");

console.log("Balance of address3 is " + dummycoin.getBalanceAddress("address3"));

dummycoin.createTransaction(new Transaction("address4", "address3", 100));
dummycoin.createTransaction(new Transaction("address3", "address1", 50));

console.log("\nStarting the miner...");
dummycoin.minePendingTransactions("address3");

console.log("Balance of address3 is " + dummycoin.getBalanceAddress("address3"));

//checking whether chain has been tempered or not
console.log("\nIs chain valid?", dummycoin.isChainValid());

//seeing the latest block
console.log("\nLatest Block :\n", dummycoin.getLatestBlock());

//displaying the entire blockchain in console
// console.log(JSON.stringify(dummycoin, null, 1));

// tampering the chain by
// changing the hash of second block
// dummycoin.chain[1].hash = "bulbul";
// console.log("Is chain valid?", dummycoin.isChainValid());

// data(transactions), timestamp, index has been set private and cannot be changed from outside
// even if someone try to change the transaction data, and recalculate hash of the block,
// it will still be caught since its correct hash is stored in the successive block
// the only loophole is that the lastest block can be tampered if the its transaction data
// and corresponding hash is changed since its correct hash is stored nowhere as there is no successive block