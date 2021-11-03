const { SHA3 } = require('sha3');

class MerkleTree {

  constructor() {
    this.merkleTreeRoot = null;
  }

  getMerkleTreeRoot() {
    return this.merkleTreeRoot;
  }

  arrayRemove(arr, value) {
   return arr.filter(function(elem){
       return elem != value;
   });
  }

  merkle_tree_check1(transactionIDArray) {
    if (transactionIDArray.length == 1) {
      let sha3 = new SHA3(256).update(String(transactionIDArray[0]));
      this.merkleTreeRoot = sha3.digest('hex');
    }
  }

  merkle_tree_check2(transactionIDArray) {
    if (transactionIDArray.length == 2) {
      let getEl1 = transactionIDArray[0];
      let getEl2 = transactionIDArray[1];
      let sha3 = new SHA3(256).update(String(getEl1 + getEl2));
      this.merkleTreeRoot = sha3.digest('hex');
    }
  }

  buildTree(transactionIDArray) {
    let newArray1 = Array.from(transactionIDArray);
    let newArr = Array.from(transactionIDArray);

    let a = [];

    // this.merkle_tree_check1(newArray1);
    // this.merkle_tree_check2(newArray1);

    let pos1 = 0;
    let pos2 = 1;
    let arraySize = 0;

    if (newArray1.length % 2 != 0) {
      arraySize = newArray1 + 1;
      newArr.push(newArr[newArr.length - 1]);
    } else {
      arraySize = newArray1;
    }


    while (newArray1.length > 2) {

      if (newArray1.length % 2 != 0) {
        newArray1.push(newArray1[newArray1.length - 1]);
      }

      if (pos1 > newArray1.length - 1 && pos2 > newArray1.length) {
        pos1 = 0;
        pos2 = 1;
      }

      let getEl1 = newArray1[pos1];
      let getEl2 = newArray1[pos2];

      let sha3 = new SHA3(256).update(String(getEl1 + getEl2));
      newArray1[pos1] = sha3.digest('hex');
      a.push(sha3.digest('hex'));

      newArray1 = this.arrayRemove(newArray1, newArray1[pos2]);

      pos1 += 1;
      pos2 += 1;

      if (a.length == arraySize - 1) {
        break;
      }
    }

    this.merkle_tree_check1(newArray1);
    this.merkle_tree_check2(newArray1);
    a.push(this.merkleTreeRoot);
    a = a.reverse();

    let p1 = 1;
    let p2 = 2;

    while (p1 < a.length && p2 < a.length) {
      let temp = a[p1];
      a[p1] = a[p2];
      a[p2] = temp;

      p1 += 2;
      p2 += 2;
    }

    for (let i = 0; i < newArr.length; i++) {
      a.push(newArr[i]);
    }
    return a;
  }
}

module.exports.MerkleTree = MerkleTree;
