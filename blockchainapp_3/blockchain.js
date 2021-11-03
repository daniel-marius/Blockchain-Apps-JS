let BlockHeader = require("./blockheader").BlockHeader;
let Transaction = require("./transaction").Transaction;
let Block = require("./block").Block;
let Consensus = require("./consensus").Consensus;
let Wallet = require("./wallet").Wallet;
let MerkleTree = require("./merkletree").MerkleTree;
let NodeTree = require("./nodetree").NodeTree;
let BinaryTree = require("./binarytree").BinaryTree;
let ArrayUtils = require("./utilsarray").ArrayUtils;
let QueueArray = require("./queuearray").QueueArray;
let objectBytesSize = require("object-sizeof");
let fs = require("fs");

class Blockchain {
  constructor(hostingAddress) {
    this.hostingAddress = hostingAddress;
    this.pendingTransactions = [];
    this.pendingTransactionsIDs = [];
    this.rejectedChain = [];
    this.consensus = new Consensus();
    this.merkletree = new MerkleTree();
    this.chain = [this.createGenesisBlock()];
    this.diffID = 2;
    this.arrayUtils = new ArrayUtils();
  }

  createMerkleTreeRoot(arrayTransactionIDs) {
    let arrHashes = this.merkletree.buildTree(arrayTransactionIDs);
    return arrHashes[0];
  }

  buildBinaryMerkleTree(arrayTransactionIDs) {
    let finalArrayHashes = this.merkletree.buildTree(arrayTransactionIDs);
    let rootTree = new NodeTree();
    let binaryMerkleTree = new BinaryTree(rootTree);
    binaryMerkleTree.rootTree = binaryMerkleTree.insertLevelOrder(
      finalArray,
      binaryMerkleTree.rootTree,
      0
    );
    binaryMerkleTree.printInOder(binaryMerkleTree.rootTree);
  }

  createGenesisBlock() {
    let initMrklRoot = "Root";
    let notDefParam = "Not Defined";

    let bh = new BlockHeader();
    bh.versionID = 1;
    bh.prevHash = notDefParam;
    bh.mrklRoot = initMrklRoot;
    bh.beneficiaryID = notDefParam;
    bh.heightID = 0;
    bh.difficultyID = 0;
    bh.nonceID = 0;
    bh.currHash = bh.calculateHash(bh);
    bh.blockID = bh.calculateHashTwice(bh);

    let b = new Block(bh, []);
    return b;
  }

  verifyProofOfWork(hashPOW, numDiff) {
    let numZeros = "";
    for (let i = 0; i < numDiff; i++) {
      numZeros += "0";
    }

    if (hashPOW.includes(numZeros)) {
      return true;
    }
    return false;
  }

  verifyChain(chain) {
    let blockchain = Array.from(chain);
    let getTransactionIDList1 = [];
    let getTransactionIDList2 = [];

    for (let i = 1; i < blockchain.length; i++) {
      let currentBlockHeader = blockchain[i]["blockheader"];
      let previousBlockHeader = blockchain[i - 1]["blockheader"];

      let prevBlocKHeaderString =
        blockchain[i - 1]["blockheader"].versionID +
        blockchain[i - 1]["blockheader"].blockID +
        blockchain[i - 1]["blockheader"].prevHash +
        blockchain[i - 1]["blockheader"].currHash +
        blockchain[i - 1]["blockheader"].mrklRoot +
        blockchain[i - 1]["blockheader"].beneficiaryID +
        blockchain[i - 1]["blockheader"].heightID +
        blockchain[i - 1]["blockheader"].difficultyID +
        blockchain[i - 1]["blockheader"].nonceID;

      let getTransactionsPreviousBlock = blockchain[i - 1]["transactions"];
      for (let j = 0; j < getTransactionsPreviousBlock.length; j++) {
        getTransactionIDList1.push(
          getTransactionsPreviousBlock[j].transactionID
        );
      }

      let getTransactionsCurrentBlock = blockchain[i]["transactions"];
      for (let j = 0; j < getTransactionsCurrentBlock.length; j++) {
        getTransactionIDList2.push(
          getTransactionsCurrentBlock[j].transactionID
        );
      }

      let previousBlockRebuildMerkleTree = this.createMerkleTreeRoot(
        getTransactionIDList1
      );
      let currentBlockRebuildMerkleTree = this.createMerkleTreeRoot(
        getTransactionIDList2
      );

      getTransactionIDList1 = [];
      getTransactionIDList2 = [];

      let nonce = 0;
      let getValues = this.consensus.mineBlockPOW(
        this.diffID,
        String(prevBlocKHeaderString),
        nonce
      );

      if (this.verifyProofOfWork(getValues[1], this.diffID) == false) {
        return false;
      }

      if (currentBlockHeader.currHash !== getValues[1]) {
        return false;
      }

      if (currentBlockHeader.prevHash !== previousBlockHeader.currHash) {
        return false;
      }

      if (currentBlockHeader.mrklRoot !== currentBlockRebuildMerkleTree) {
        return false;
      }

      if (currentBlockHeader.heightID !== previousBlockHeader.heightID + 1) {
        return false;
      }

      if (currentBlockHeader.difficultyID !== this.diffID) {
        return false;
      }

      if (currentBlockHeader.nonceID !== getValues[0]) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Shorter Chain");
      return;
    } else if (!this.verifyChain(newChain)) {
      console.log("Invalid Chain");
      return;
    }

    this.chain = newChain;
  }

  saveBlockchainFile() {
    let chainCopy = Array.from(this.chain);
    let fileToWrite = "./myblockchain.json";
    let jsonFormatData = JSON.stringify(chainCopy);
    try {
      fs.exists(fileToWrite, exists => {
        if (exists) {
          this.loadBlockchainFile();
          chainCopy = Array.from(this.chain);
          jsonFormatData = JSON.stringify(chainCopy);
          fs.writeFile(fileToWrite, jsonFormatData, err => {
            if (err) {
              throw err;
            }
            console.log("Data written to the file!");
          });
        } else {
          fs.writeFile(fileToWrite, jsonFormatData, err => {
            if (err) {
              throw err;
            }
            console.log("Data written to the file!");
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  loadBlockchainFile() {
    let fileToRead = "./myblockchain.json";
    try {
      fs.exists(fileToRead, exists => {
        if (exists) {
          fs.readFile(fileToRead, "utf8", (err, data) => {
            if (err) {
              throw err;
            }
            this.chain = JSON.parse(data);
            console.log("Data loaded from the file!");
          });
        } else {
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  getCurrDiff() {
    return this.diffID;
  }

  getChainSize() {
    if (this.chain.length > 0) {
      return this.chain.length;
    }
    return -1;
  }

  isEmpty() {
    return this.getChainSize() === 0;
  }

  printChain() {
    for (let i = 0; i < this.chain.length; i++) {
      console.log(this.chain[i]);
    }
  }

  getChain() {
    if (this.chain.length > 0) {
      return this.chain;
    }
    return -1;
  }

  getFirstBlock() {
    if (this.chain.length > 0) {
      return this.chain[0];
    }
    return null;
  }

  getFirstBlockHeader() {
    if (this.chain.length > 0) {
      return this.chain[0]["blockheader"];
    }
    return null;
  }

  getFirstBlockTransactions() {
    if (this.chain.length > 0) {
      return this.chain[0]["transactions"];
    }
    return null;
  }

  getLastBlock() {
    if (this.chain.length > 0) {
      return this.chain[this.chain.length - 1];
    }
    return null;
  }

  getLastBlockHeader() {
    if (this.chain.length > 0) {
      return this.chain[this.chain.length - 1]["blockheader"];
    }
    return null;
  }

  getLastBlockTransactions() {
    if (this.chain.length > 0) {
      return this.chain[this.chain.length - 1]["transactions"];
    }
    return null;
  }

  getBlockOnIndex(index) {
    if (index >= 0 && index < this.chain.length) {
      return this.chain[index];
    }
    return null;
  }

  getBlockHeaderOnIndex(index) {
    if (index >= 0 && index < this.chain.length) {
      return this.chain[index]["blockheader"];
    }
    return null;
  }

  getBlockTransactionsOnIndex(index) {
    if (index >= 0 && index < this.chain.length) {
      return this.chain[index]["transactions"];
    }
    return null;
  }

  getTransactionFromBlockOnIndex(index1, index2) {
    const myTransaction = null;
    if (index1 >= 0 && index2 >= 0) {
      const transactionList = this.chain[index1]["transactions"];
      for (let i = 0; i < transactionList.length; i++) {
        myTransaction = transactionList[index2];
      }
    }
    return myTransaction;
  }

  getBlockByPrevHash(prevHash) {
    let arrayPrevHash = [];
    for (const block of this.chain) {
      arrayPrevHash.push(block.blockheader.prevHash);
    }
    let start = 0;
    let end = arrayPrevHash.length;
    let indexFound = this.arrayUtils.binarySearchRecursive(
      arrayPrevHash,
      start,
      end,
      prevHash
    );

    if (indexFound == false) {
      return false;
    } else if (indexFound >= 0 && indexFound < this.chain.length) {
      return this.chain[indexFound];
    }
  }

  getBlockByCurrHash(currHash) {
    let arrayCurrHash = [];
    for (const block of this.chain) {
      arrayCurrHash.push(block.blockheader.currHash);
    }
    let start = 0;
    let end = arrayCurrHash.length;
    let indexFound = this.arrayUtils.binarySearchRecursive(
      arrayCurrHash,
      start,
      end,
      currHash
    );

    if (indexFound == false) {
      return false;
    } else if (indexFound >= 0 && indexFound < this.chain.length) {
      return this.chain[indexFound];
    }
  }

  getBlockByHeight(height) {
    let arrayHeights = [];
    for (const block of this.chain) {
      arrayHeights.push(block.blockheader.heightID);
    }
    let start = 0;
    let end = arrayHeights.length;
    let indexFound = this.arrayUtils.binarySearchRecursive(
      arrayHeights,
      start,
      end,
      height
    );

    if (indexFound == false) {
      return false;
    } else if (indexFound >= 0 && indexFound < this.chain.length) {
      return this.chain[indexFound];
    }
  }

  getLastButOneBlockHeaderString() {
    if (this.chain.length > 0) {
      let blockHeaderString =
        this.chain[this.chain.length - 2]["blockheader"].versionID +
        this.chain[this.chain.length - 2]["blockheader"].blockID +
        this.chain[this.chain.length - 2]["blockheader"].prevHash +
        this.chain[this.chain.length - 2]["blockheader"].currHash +
        this.chain[this.chain.length - 2]["blockheader"].mrklRoot +
        this.chain[this.chain.length - 2]["blockheader"].beneficiaryID +
        this.chain[this.chain.length - 2]["blockheader"].heightID +
        this.chain[this.chain.length - 2]["blockheader"].difficultyID +
        this.chain[this.chain.length - 2]["blockheader"].nonceID;
      return String(blockHeaderString);
    }
    return null;
  }

  getLastBlockHeaderString() {
    if (this.chain.length > 0) {
      let blockHeaderString =
        this.chain[this.chain.length - 1]["blockheader"].versionID +
        this.chain[this.chain.length - 1]["blockheader"].blockID +
        this.chain[this.chain.length - 1]["blockheader"].prevHash +
        this.chain[this.chain.length - 1]["blockheader"].currHash +
        this.chain[this.chain.length - 1]["blockheader"].mrklRoot +
        this.chain[this.chain.length - 1]["blockheader"].beneficiaryID +
        this.chain[this.chain.length - 1]["blockheader"].heightID +
        this.chain[this.chain.length - 1]["blockheader"].difficultyID +
        this.chain[this.chain.length - 1]["blockheader"].nonceID;
      return String(blockHeaderString);
    }
    return null;
  }

  getBlockHeaderOnIndexString(index) {
    if (index >= 0 && index < this.chain.length) {
      let blockHeaderString =
        this.chain[index]["blockheader"].versionID +
        this.chain[index]["blockheader"].blockID +
        this.chain[index]["blockheader"].prevHash +
        this.chain[index]["blockheader"].currHash +
        this.chain[index]["blockheader"].mrklRoot +
        this.chain[index]["blockheader"].beneficiaryID +
        this.chain[index]["blockheader"].heightID +
        this.chain[index]["blockheader"].difficultyID +
        this.chain[index]["blockheader"].nonceID +
        index;
      return String(blockHeaderString);
    }
    return null;
  }

  createTransactions(transaction, walletObj) {
    if (
      !walletObj.checkAddressFormat(transaction.senderID) &&
      !walletObj.checkAddressFormat(transaction.recipientID)
    ) {
      throw new Error("Invalid address format!");
    }

    if (transaction.amountID < 0) {
      throw new Error("Amount has to be positive!");
    }

    if (transaction.amountID > this.balanceUser(this.hostingAddress[0])) {
      throw new Error("Not enough balance!");
    }

    if (!walletObj.verifySignature(transaction, hostingAddress)) {
      throw new Error("Cannot add invalid transaction to the chain!");
    }

    this.pendingTransactions.push(transaction);
    this.pendingTransactionsIDs.push(transaction.transactionID);
  }

  createNewBlocks(walletObj) {
    if (
      !walletObj.checkAddressFormat(this.hostingAddress[0]) ||
      this.hostingAddress[0].length === null
    ) {
      throw new Error("Invalid address format or null length");
    }

    let lastBlockHeader = this.getLastBlockHeaderString();
    let nonce = 0;
    let getValues = this.consensus.mineBlockPOW(
      this.diffID,
      lastBlockHeader,
      nonce
    );
    let mySender = "System";
    let myRecipient = this.hostingAddress;
    let mySignature = "No Signature";

    let t = new Transaction();
    t.senderID = mySender;
    t.recipientID = myRecipient[0];
    t.amountID = 10;
    t.miningFees = 0;
    t.relayFees = 0;
    t.transactionID = t.calculateHashTwice(t);
    t.signatureID = mySignature;

    this.pendingTransactions.push(t);
    this.pendingTransactionsIDs.push(t.transactionID);

    let merkleTreeRoot = this.createMerkleTreeRoot(this.pendingTransactionsIDs);

    let bh = new BlockHeader();
    bh.versionID = 1;
    bh.prevHash = this.chain[this.chain.length - 1]["blockheader"].currHash;
    bh.currHash = getValues[1];
    bh.mrklRoot = merkleTreeRoot;
    bh.beneficiaryID = myRecipient[0];
    bh.heightID = this.chain[this.chain.length - 1]["blockheader"].heightID + 1;
    bh.difficultyID = this.diffID;
    bh.nonceID = getValues[0];
    bh.blockID = bh.calculateHashTwice(bh);

    let b = new Block(bh, this.pendingTransactions);

    this.chain.push(b);
    this.pendingTransactions = [];
    this.pendingTransactionsIDs = [];
  }

  addBlocksFromIndex(index, walletObj) {
    if (
      !walletObj.checkAddressFormat(this.hostingAddress[0]) ||
      this.hostingAddress[0].length === null
    ) {
      throw new Error("Invalid address format or null length");
    }

    let previousBlockHeader = this.getBlockHeaderOnIndexString(index - 1);

    let nonce = 0;
    let getValues = this.consensus.mineBlockPOW(
      this.diffID,
      previousBlockHeader,
      nonce
    );
    let mySender = "System";
    let myRecipient = this.hostingAddress;
    let mySignature = "No Signature";

    let t = new Transaction();
    t.senderID = mySender;
    t.recipientID = myRecipient[0];
    t.amountID = 10;
    t.miningFees = 0;
    t.relayFees = 0;
    t.transactionID = t.calculateHashTwice(t);
    t.signatureID = mySignature;

    this.pendingTransactions.push(t);
    this.pendingTransactionsIDs.push(t.transactionID);

    let merkleTreeRoot = this.createMerkleTreeRoot(this.pendingTransactionsIDs);

    let bh = new BlockHeader();
    bh.versionID = 1;
    bh.prevHash = this.chain[index - 1]["blockheader"].currHash;
    bh.currHash = getValues[1];
    bh.mrklRoot = merkleTreeRoot;
    bh.beneficiaryID = myRecipient[0];
    bh.heightID = index;
    bh.difficultyID = this.diffID;
    bh.nonceID = getValues[0];
    bh.blockID = bh.calculateHashTwice(bh);

    let b = new Block(bh, this.pendingTransactions);

    this.chain.push(b);
    this.pendingTransactions = [];
    this.pendingTransactionsIDs = [];

    let lastButOneBlockHeader = this.getLastButOneBlockHeaderString();

    nonce = 0;
    getValues = this.consensus.mineBlockPOW(
      this.diffID,
      lastButOneBlockHeader,
      nonce
    );
    mySender = "System";
    myRecipient = this.hostingAddress;
    mySignature = "No Signature";

    t = new Transaction();
    t.senderID = mySender;
    t.recipientID = myRecipient[0];
    t.amountID = 10;
    t.miningFees = 0;
    t.relayFees = 0;
    t.transactionID = t.calculateHashTwice(t);
    t.signatureID = mySignature;

    this.pendingTransactions.push(t);
    this.pendingTransactionsIDs.push(t.transactionID);

    merkleTreeRoot = this.createMerkleTreeRoot(this.pendingTransactionsIDs);

    bh = new BlockHeader();
    bh.versionID = 1;
    bh.prevHash = this.chain[this.chain.length - 2]["blockheader"].currHash;
    bh.currHash = getValues[1];
    bh.mrklRoot = merkleTreeRoot;
    bh.beneficiaryID = myRecipient[0];
    bh.heightID = this.chain[this.chain.length - 2]["blockheader"].heightID + 1;
    bh.difficultyID = this.diffID;
    bh.nonceID = getValues[0];
    bh.blockID = bh.calculateHashTwice(bh);

    b = new Block(bh, this.pendingTransactions);

    this.chain.push(b);
    this.pendingTransactions = [];
    this.pendingTransactionsIDs = [];
  }

  blockchainTreeTraversalBFS(root) {
    if (root == null) {
      return;
    }

    let visited = [];
    for (let i = 0; i < this.chain.length; i++) {
      visited[i] = 0;
    }

    visited[root] = 1;

    let queue = new QueueArray();
    queue.enQueue(root);

    while (queue.length != 0) {
      let getEl = queue.queueFront();
      console.log(this.chain[getEl]["blockheader"]);
      queue.deQueue();

      for (let i = 0; i < this.chain.length; i++) {
        if (
          visited[i] == 0 &&
          this.chain[i]["blockheader"].prevHash ==
            this.chain[getEl]["blockheader"].currHash &&
          this.chain[i]["blockheader"].heightID ==
            this.chain[getEl]["blockheader"].heightID + 1
        ) {
          queue.enQueue(i);
          visited[i] = 1;
        }
      }
    }
  }

  heightBlockchainTreeTraversalDFS(startNode) {
    let maxDepth = 0;
    for (let i = 0; i < this.chain.length; i++) {
      if (
        this.chain[i]["blockheader"].prevHash ==
          this.chain[startNode]["blockheader"].currHash &&
        this.chain[i]["blockheader"].heightID ==
          this.chain[startNode]["blockheader"].heightID + 1
      ) {
        maxDepth = Math.max(maxDepth, this.heightBlockchainTreeTraversalDFS(i));
      }
    }
    return 1 + maxDepth;
  }

  blockchainTreeTraversalDFS(startNode, vector, visited) {
    vector.push(this.chain[startNode]);
    visited[this.chain[startNode]["blockheader"].heightID] = true;
    for (let i = 0; i < this.chain.length; i++) {
      if (
        visited[this.chain[i]["blockheader"].heightID] == false &&
        this.chain[i]["blockheader"].prevHash ==
          this.chain[startNode]["blockheader"].currHash &&
        this.chain[i]["blockheader"].heightID ==
          this.chain[startNode]["blockheader"].heightID + 1
      ) {
        this.blockchainTreeTraversalDFS(i, vector, visited);
      }
    }
  }

  // Longest chain rule
  blockchainTreeTraversalDFSUtil(startNode) {
    let vector = [];
    let visited = [];
    for (let i = 0; i < this.chain.length; i++) {
      visited[this.chain[i]["blockheader"].heightID] = false;
    }
    this.blockchainTreeTraversalDFS(startNode, vector, visited);
    this.chain = vector;
  }

  dfsTraversal(startNode, dist, parent, freq, vis) {
    vis[startNode] = true;
    for (let i = 0; i < this.chain.length; i++) {
      if (
        vis[i] == false &&
        this.chain[i]["blockheader"].prevHash ==
          this.chain[startNode]["blockheader"].currHash
      ) {
        parent[i] = startNode;
        dist[i] = dist[startNode] + 1;
        freq[dist[i]] += 1;
        this.dfsTraversal(i, dist, parent, freq, vis);
      }
    }
  }

  utilDFSTraversalLCA(startNode, x, y) {
    let dist = [];
    let parent = [];
    let freq = [];
    let vis = [];
    for (let i = 0; i < this.chain.length; i++) {
      dist[i] = 0;
      parent[i] = 0;
      freq[i] = 0;
      vis[i] = false;
    }

    dist[startNode] = 0;
    parent[startNode] = -1;
    freq[startNode] += 1;

    this.dfsTraversal(startNode, dist, parent, freq, vis);
    let treeHeight = this.arrayUtils.maxElem(dist) + 1;
    let treeWidth = this.arrayUtils.maxElem(freq);

    console.log("Tree Height: " + treeHeight);
    console.log("Tree Width: " + treeWidth);

    if (x == y) {
      if (
        this.chain[x]["blockheader"].heightID ==
        this.chain[y]["blockheader"].heightID
      ) {
        return parent[x];
      }
    }

    while (x != y) {
      if (dist[x] > dist[y]) {
        x = parent[x];
      } else {
        y = parent[y];
      }
    }
    return x;
  }

  balanceUser(userAddress) {
    let amount1 = 0;
    let amount2 = 0;
    let fees1 = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.senderID === userAddress) {
          amount1 += trans.amountID;
          fees1 += trans.miningFees;
        }
        if (trans.recipientID === userAddress) {
          amount2 += trans.amountID;
        }
      }
    }

    let diff1 = amount2 - amount1;
    let balance = diff1 + fees1;
    return balance;
  }
}

let wallet = new Wallet();
// wallet.saltRand = cryptoRandomString({ length: 10, type: 'base64'});
// wallet.saveECCPrivateKey();
wallet.loadECCKeys();
// wallet.saveUserAddress();

let hostingAddress = wallet.loadUserAddress();

let blck = new Blockchain(hostingAddress);
blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);

let t = new Transaction();
t.senderID = hostingAddress[0];
t.recipientID = hostingAddress[0];
t.amountID = 10;
t.miningFees = 1;
t.relayFees = 0;
t.transactionID = t.calculateHashTwice(t);
t.signatureID = wallet.createSignature(t);

blck.createTransactions(t, wallet);
blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);
blck.addBlocksFromIndex(2, wallet);
blck.addBlocksFromIndex(3, wallet);
blck.addBlocksFromIndex(4, wallet);

blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);
blck.createNewBlocks(wallet);

//blck.loadBlockchainFile();

blck.createNewBlocks(wallet);

blck.saveBlockchainFile();

//let startNode = 0, node1 = 9, node2 = 3;
//console.log("LCA of " + node1 + " and " + node2 + " is: " + blck.utilDFSTraversalLCA(startNode, node1, node2));

//let height = 9;
//console.log(blck.getBlockByHeight(height));

// blck.loadBlockchainFile();
// blck.printChain();

// let node = 0;
// blck.blockchainTreeTraversalDFSUtil(node);

// blck.saveBlockchainFile();
// console.log(blck.verifyChain(blck.getChain()));
// blck.printChain();
// console.log(blck.getChainSize());
// console.log(blck.heightBlockchainTreeTraversalDFS(node));
// console.log(blck.balanceUser(hostingAddress[0]));
