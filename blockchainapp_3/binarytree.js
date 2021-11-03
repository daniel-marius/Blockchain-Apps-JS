let NodeTree = require("./nodetree").NodeTree;

class BinaryTree {
  constructor(root) {
    this.root = root;
  }

  insertLevelOrder(array, root, index) {
    if (index < array.length) {
      let node = new NodeTree(array[index]);
      root = node;
      root.left = this.insertLevelOrder(array, root.left, 2 * index + 1);
      root.right = this.insertLevelOrder(array, root.right, 2 * index + 2);
    }
    return root;
  }

  printPreOrder(root) {
    if (root != null) {
      console.log(root.data + " ");
      this.printPreOrder(root.left);
      this.printPreOrder(root.right);
    }
  }

  printInOrder(root) {
    if (root != null) {
      this.printInOrder(root.left);
      console.log(root.data + " ");
      this.printInOdrer(root.right);
    }
  }

  printPostOrder(root) {
    if (root != null) {
      this.printPostOrder(root.left);
      this.printPostOrder(root.right);
      console.log(root.data + " ");
    }
  }

  verifyTransactionID(root, transactionID) {
    if (root == null) {
      return false;
    }

    if (root.data == transactionID) {
      // console.log(root.data);
      // console.log(transactionID);
      return true;
    } else {
      return (
        this.verifyTransactionID(root.left, transactionID) ||
        this.verifyTransactionID(root.right, transactionID)
      );
    }
  }
}

module.exports.BinaryTree = BinaryTree;
