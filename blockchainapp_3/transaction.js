const crypto = require('crypto');
const { SHA3 } = require('sha3');

class Transaction {

  constructor(transactionID,
              senderID,
              recipientID,
              signatureID,
              amountID,
              miningFees,
              relayFees) {
    this.transactionID = transactionID;
    this.senderID = senderID;
    this.recipientID = recipientID;
    this.signatureID = signatureID;
    this.amountID = amountID;
    this.miningFees = miningFees;
    this.relayFees = relayFees;
  }

  calculateHash(transaction) {
    let transactionString = transaction.transactionID +
                            transaction.senderID +
                            transaction.recipientID +
                            transaction.amountID +
                            transaction.miningFees +
                            transaction.relayFees;

    return new SHA3(256).update(String(transactionString)).digest('hex');
  }

  calculateHashTwice(transaction) {
    let transactionString = transaction.transactionID +
                            transaction.senderID +
                            transaction.recipientID +
                            transaction.amountID +
                            transaction.miningFees +
                            transaction.relayFees;
    let sha3 = new SHA3(256);
    sha3.update(String(transactionString));
    let result = sha3.digest('hex');
    sha3.update(result);
    return sha3.digest('hex');
  }

}

module.exports.Transaction = Transaction;
