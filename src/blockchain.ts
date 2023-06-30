const { SHA256 } = require("crypto-js")

class Block {
  private index : number;
  private timestamp : string;
  private data : any;
  public previousHash : string;
  public hash : string;
  public nonce : number;

  constructor(index:number, timestamp:string, data:any, previousHash:string='') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() : string {
    return SHA256(
      this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce
    ).toString();
  }

  mineBlock(difficulty : number) : void {
    while(this.hash.substring(0, difficulty) !== Array(difficulty).fill("0").join("")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block Mined: " + this.hash);
  }
}

class Blockchain {
  chain : Block[];
  difficulty : number;

  constructor() {
    this.difficulty = 3;
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock() : Block {
    let genesisBlock : Block = new Block(0, "20/06/2023", "Genesis Block", "0");
    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  addBlock(newBlock : Block) : void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();

    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  getLatestBlock() : Block {
    return this.chain[this.chain.length-1];
  }
  
  isChainValid() : boolean {
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

//adding new blocks
console.log("Mining Block 1...");
dummycoin.addBlock(new Block(1, "21/06/2023", {amount : 4}));

console.log("Mining Block 2...");
dummycoin.addBlock(new Block(2, "23/06/2023", {amount : 2}));

//displaying the entire blockchain in console
console.log(JSON.stringify(dummycoin, null, 1));

//checking whether chain has been tempered or not
console.log("Is chain valid?", dummycoin.isChainValid());

//tampering the chain by
//changing the hash of second block
// dummycoin.chain[1].hash = "bulbul";
// console.log("Is chain valid?", dummycoin.isChainValid());

//body, timestamp, index has been set private and cannot be changed from outside
//even if someone try to change the body, and recalculate hash of the block,
//it will still be caught since its correct hash is stored in the successive block
//the only loophole is that the lastest block can be tampered if the body and corresponding
//hash is changed since its correct hash is stored nowhere as there is no successive block