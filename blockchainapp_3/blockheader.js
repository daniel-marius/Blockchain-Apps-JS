const { SHA3 } = require("sha3");

class BlockHeader {
  constructor(
    versionID,
    blockID,
    prevHash,
    currHash,
    mrklRoot,
    beneficiaryID,
    heightID,
    difficultyID,
    nonceID
  ) {
    this.versionID = versionID;
    this.blockID = blockID;
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.mrklRoot = mrklRoot;
    this.beneficiaryID = beneficiaryID;
    this.heightID = heightID;
    this.difficultyID = difficultyID;
    this.nonceID = nonceID;
    let time = new Date();
    this.timeID = time.getTime();
  }

  calculateHash(blockheaderparam) {
    let blockheaderString =
      blockheaderparam.versionID +
      blockheaderparam.blockID +
      blockheaderparam.prevHash +
      blockheaderparam.currHash +
      blockheaderparam.mrklRoot +
      blockheaderparam.beneficiaryID +
      blockheaderparam.heightID +
      blockheaderparam.difficultyID +
      blockheaderparam.nonceID;
    let sha3 = new SHA3(256);
    sha3.update(String(blockheaderString));
    return sha3.digest("hex");
  }

  calculateHashTwice(blockheaderparam) {
    let blockheaderString =
      blockheaderparam.versionID +
      blockheaderparam.blockID +
      blockheaderparam.prevHash +
      blockheaderparam.currHash +
      blockheaderparam.mrklRoot +
      blockheaderparam.beneficiaryID +
      blockheaderparam.heightID +
      blockheaderparam.difficultyID +
      blockheaderparam.nonceID;
    let sha3 = new SHA3(256);
    sha3.update(String(blockheaderString));
    let result = sha3.digest("hex");
    sha3.update(result);
    return sha3.digest("hex");
  }

  printObject() {
    console.log(
      this.versionID +
        "\n" +
        this.blockID +
        "\n" +
        this.prevHash +
        "\n" +
        this.currHash +
        "\n" +
        this.mrklRoot +
        "\n" +
        this.beneficiaryID +
        "\n" +
        this.heightID +
        "\n" +
        this.difficultyID +
        "\n" +
        this.nonceID +
        "\n" +
        this.timeID +
        "\n"
    );
  }
}

module.exports.BlockHeader = BlockHeader;
