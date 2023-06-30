const { SHA256 } = require("crypto-js");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

export class Transaction {
  fromAddress : string;
  toAddress : string;
  amount : number;
  timestamp : number;
  signature : string;

  constructor(fromAddress : string, toAddress : string, amount : number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = '';           
  }

  calculateTransactionHash() : string {
    return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
  }

  signTransaction(signingKey : any) {
    if(signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error("You can't sign transactions for other wallets!");
    }

    const originalHashtx = this.calculateTransactionHash();
    const sig = signingKey.sign(originalHashtx, 'base64');
    this.signature = sig.toDER('hex');
  }

  isValid() : boolean {
    //to handle mining reward transaction
    if(this.toAddress == "null") return true;

    //if no signature present
    if(!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction!");
    }
    //turning our public key into publicKey object
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    //recalculating hash of transaction
    const newHashtx = this.calculateTransactionHash();

    //the encrypted original hash(i.e., signature) would be decrypted by public key
    //and then compared with the newly calculated hash(newHashtx) of transaction object 
    return publicKey.verify(newHashtx, this.signature);
  }
}

class Block {
  public previousHash : string;
  private timestamp : number;
  private transactions : Transaction[];
  public nonce : number;
  public hash : string;

  constructor(timestamp:number, transactions:Transaction[], previousHash:string='') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateBlockHash();
  }

  calculateBlockHash() : string {
    return SHA256(
      this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce
    ).toString();
  }

  mineBlock(difficulty : number) : void {
    while(this.hash.substring(0, difficulty) !== Array(difficulty).fill("0").join("")) {
      this.nonce++;
      this.hash = this.calculateBlockHash();
    }
  }

  getTransactionsDataOfBlock() : Transaction[] {
    // handle the case when there are no transactions in the block.
    return this.transactions || [];
  }

  hasValidTransactions() : boolean {
    for(let i = 0; i<this.transactions.length; i++) {
      const unitTransaction = this.transactions[i];
      if(unitTransaction.isValid() == false) {
        return false;
      }
    }
    return true;
  }
}

export class Blockchain {
  private chain : Block[];
  private difficulty : number;
  private pendingTransactions : Transaction[];
  private miningReward : number;
  private lastDifficultyAdjustmentBlock : number;

  constructor() {
    this.difficulty = 3;
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.lastDifficultyAdjustmentBlock = 0;
  }

  private createGenesisBlock() : Block {
    const genesisBlock = new Block(Date.now(), this.pendingTransactions, "0");
    genesisBlock.mineBlock(this.difficulty);
    console.log(`\nGenesis\nBlock 0 Mined : ${genesisBlock.hash}`);
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
      Date.now(), this.pendingTransactions, this.getLatestBlock().hash
    ); 

    newBlock.mineBlock(this.getDifficulty());
    this.chain.push(newBlock);
    console.log(`\nBlock ${this.chain.length-1} Mined : ${this.getLatestBlock().hash}`);

    this.pendingTransactions = [];
  }

  public addTransaction(transaction : Transaction) : void {
    if(!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address!");
    }
    if(!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }
    if(transaction.amount <= 0) {
      throw new Error("Transaction amount should be greater than 0!");
    }

    const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
    if(transaction.amount > walletBalance) {
      throw new Error("Not Enough Balance!");
    }
    this.pendingTransactions.push(transaction);
  }

  public getBalanceOfAddress(walletAddress : string) : number{
    let balance = 0;
    
    for(let i = 0; i<this.chain.length; i++) {
      let transactionList = this.chain[i].getTransactionsDataOfBlock();
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

    if(previousBlock.hash !== previousBlock.calculateBlockHash()) {
      return false;
    }

    for(let i=1; i<this.chain.length; i++) {
      let currentBlock :Block = this.chain[i];

      if(!currentBlock.hasValidTransactions()) {
        return false;
      }

      if(currentBlock.hash !== currentBlock.calculateBlockHash()) {
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



// tampering the chain by
// changing the hash of second block
// dummycoin.chain[1].hash = "bulbul";
// console.log("Is chain valid?", dummycoin.isChainValid());

// data(transactions), timestamp, index has been set private and cannot be changed from outside
// even if someone try to change the transaction data, and recalculate hash of the block,
// it will still be caught since its correct hash is stored in the successive block
// the only loophole is that the lastest block can be tampered if the its transaction data
// and corresponding hash is changed since its correct hash is stored nowhere as there is no successive block