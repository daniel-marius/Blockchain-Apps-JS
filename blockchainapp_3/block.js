class Block {

  constructor(blockheader, transactions) {
    this.blockheader = blockheader;
    this.transactions = transactions;
  }
}

module.exports.Block = Block;
