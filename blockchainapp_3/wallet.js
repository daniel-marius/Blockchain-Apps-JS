const crypto = require('crypto');
const { SHA3 } = require('sha3');
const cryptoRandomString = require('crypto-random-string');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fs = require('fs');

class Wallet {

  constructor() {
    this.saltRand = '';
    this.masterPrivateKey = '';
    this.masterPublicKey = '';
    this.derivedPrivateKey = '';
    this.derivedPublicKey = '';
    this.pairObj = [];
  }

  generatePassword() {
    let passwordPlain = 'Password!@1234';
    let hashSHA3 = new SHA3(256).update(passwordPlain).digest('hex');
    return hashSHA3;
  }

  generateMasterPrivateKey() {
    let getPassword = this.generatePassword();
    let saltParam = 'salt01';
    let numIters = 100;
    let keyLen = 64;
    let digestOption = 'sha3-256';
    if (!Number.isInteger(numIters) ||
        !Number.isInteger(keyLen) ||
        numIters > Math.pow(2, 20) ||
        keyLen > Math.pow(2, 10) ||
        typeof getPassword !== 'string' ||
        typeof saltParam !== 'string' ||
        typeof digestOption !== 'string') {
      throw new Error('Invalid input format');
    }
    this.masterPrivateKey = crypto.pbkdf2Sync(getPassword,
                                              saltParam,
                                              numIters,
                                              keyLen,
                                              digestOption);
    return this.masterPrivateKey.toString('hex');
  }

  generateMasterPublicKey() {
    let getMasterPrivateKey = this.generateMasterPrivateKey();
    let numIters = 100;
    let keyLen = 64;
    let digestOption = 'sha3-256';
    if (!Number.isInteger(numIters) ||
        !Number.isInteger(keyLen) ||
        numIters > Math.pow(2, 20) ||
        keyLen > Math.pow(2, 10) ||
        typeof getPassword !== 'string' ||
        typeof this.saltRand !== 'string' ||
        typeof digestOption !== 'string') {
      throw new Error('Invalid input format');
    }
    this.masterPublicKey = crypto.pbkdf2Sync(getMasterPrivateKey,
                                             this.saltRand,
                                             numIters,
                                             keyLen,
                                             digestOption);
    return this.masterPublicKey.toString('hex');
  }

  generateECCPrivateKey() {
    let getMasterPrivateKey = this.generateMasterPublicKey();
    let keyPair = ec.genKeyPair();
    let privateKey = keyPair.getPrivate();
    return privateKey.toString(16); // 16 - Represents the base (hex)
  }

  saveECCPrivateKey() {
    let privateKey = this.generateECCPrivateKey();
    let fileToWrite = './mykey.pem';
    try {
      if (fs.existsSync(fileToWrite)) {

      } else {
        fs.writeFileSync(fileToWrite, privateKey);
        console.log('The ECC private key has been saved!');
      }
    } catch (err) {
      console.log('The file could not be written!');
    }
  }

  loadECCKeys() {
    const path = './mykey.pem';
    try {
        if (fs.existsSync(path)) {
          let buffer = fs.readFileSync(path, 'utf8');
          this.derivedPrivateKey = buffer.toString(16);
          let recreatedPrivateKey = ec.keyFromPrivate(this.derivedPrivateKey, 'hex');
          this.derivedPublicKey = recreatedPrivateKey.getPublic('hex');
          console.log('The ECC keys have been loaded!');
        } else {

        }
    } catch (err) {
      console.log('File does not exists or length of file is null!');
    }
  }

  generateUserAddress() {
    let hashSHA1 = crypto.createHash('sha1');
    let hashSHA2 = crypto.createHash('sha256');
    let hashSHA3 = new SHA3(256);
    let getPublicKey = this.derivedPublicKey;

    hashSHA1.update(getPublicKey);
    let getResult1 = hashSHA1.digest('hex');

    hashSHA2.update(getResult1);
    let getResult2 = hashSHA2.digest('hex');

    hashSHA3.update(getResult2);
    let getResult3 = hashSHA3.digest('hex');

    let buff = new Buffer.from(getResult3);
    getResult3 = buff.toString('base64');
    let getResult4 = 'DM' + getResult3;

    this.pairObj = [getResult4, getPublicKey];
    return this.pairObj;
  }

  saveUserAddress() {
    let addrObj = this.generateUserAddress();
    let jsonFormatData = JSON.stringify(addrObj);
    let fileToWrite = './myuseraddr.json';
    try {
      if (fs.existsSync(fileToWrite)) {

      } else {
        fs.writeFileSync(fileToWrite, jsonFormatData);
        console.log('The address (pseudonym) has been saved!');
      }
    } catch (err) {
      console.log('The file could not be written!');
    }
  }

  loadUserAddress() {
    const path = './myuseraddr.json';
    try {
        if (fs.existsSync(path)) {
          let buffer = fs.readFileSync(path, 'utf8');
          this.pairObj = JSON.parse(buffer);
          console.log('The address has been loaded!');
          return this.pairObj;
        } else {

        }
    } catch(err) {
      console.log('File does not exists or length of file is null!');
    }
  }

  checkAddressFormat(address) {
    if (address.length < 90 || address.length > 90) {
      return false;
    } else if (address.substring(0, 2) != 'DM') {
      return false;
    } else {
      let newAddr = address.substr(2);
      let rebuildNewAddr = Buffer.from(newAddr, 'base64').toString('base64');
      if (newAddr == rebuildNewAddr && typeof(rebuildNewAddr) == 'string') {
        return true;
      } else {
        return false;
      }
    }
  }

  createSignature(transaction) {
    let myPrivKey = ec.keyFromPrivate(this.derivedPrivateKey, 'hex');
    let transactionHashHex = transaction.calculateHash(transaction);
    let signature = myPrivKey.sign(transactionHashHex, 'base64');
    return signature.toDER('hex');
  }

  verifySignature(transaction, senderID) {
    if (transaction.senderID == senderID[0]) {
      let myPubKey = ec.keyFromPublic(senderID[1], 'hex');
      let transactionHashHex = transaction.calculateHash(transaction);
      return myPubKey.verify(transactionHashHex, transaction.signatureID);
    }
    return false;
  }
}

module.exports.Wallet = Wallet;
