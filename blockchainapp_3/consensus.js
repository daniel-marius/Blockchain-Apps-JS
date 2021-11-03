const { SHA3 } = require('sha3');

class Consensus {

  constructor() {}

  calculateHashLastHeader(lastBlockHeader, nonce) {
    let sha3 = new SHA3(256);
    sha3.update(String(lastBlockHeader) + String(nonce));
    return sha3.digest('hex');
  }

  mineBlockPOW(diffID, lastBlockHeader, nonce) {
    let getHash = this.calculateHashLastHeader(lastBlockHeader, nonce);
    while (getHash.substring(0, diffID) !== Array(diffID + 1).join('0')) {
      nonce = nonce + 1;
      getHash = this.calculateHashLastHeader(lastBlockHeader, nonce);
    }
    return [nonce, getHash];
  }

  adjustDifficulty(lastBlock, mineRate, currentTime) {
    let newDiff = lastBlock.difficultyID;
    newDiff = lastBlock.timeID + mineRate > currentTime ? newDiff + 1 : newDiff - 1;
    return newDiff;
  }
}

module.exports.Consensus = Consensus;
