const Iterator = require('../patterns/iterator').Iterator;

class ArrayUtils extends Iterator {

  constructor() {
    super();
    this.position = 0;
  }

  getCurrentPosition() {
    return this.position;
  }

  insertElem(array, elem) {
    if (array.length === 0 ) {
      array[this.position] = elem;
      this.position += 1;
    } else {
      this.position = array.length;
      array[this.position] = elem;
      this.position += 1;
    }
  }

  firstElem() {
    this.postion = 0;
  }

  nextElem(array) {
    const nextPos = this.position + 1;
    return (this.postion + 1 < array.length) ? array[nextPos] : null;
  }

  isDone(array) {
    return this.position >= array.length;
  }

  currentItem(array) {
    return (this.position < array.length) ? array[this.position] : array[this.position - 1];
  }

  getSize(array) {
    return array.length;
  }

  isEmpty(){
    return this.getSize() == 0;
  }

  getElemPos(array, pos) {
    if (pos >=0 && pos < array.length) {
      return array[pos];
    }
    return null;
  }

  maxElem(array) {
    let maxEl = -100000;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > maxEl) {
        maxEl = Math.max(maxEl, array[i]);
      }
    }
    return maxEl;
  }

  minElem(array) {
    let minEl = -100000;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > minEl) {
        minEl = Math.max(minEl, array[i]);
      }
    }
    return minEl;
  }

  sumArray(array) {
    let s = 0;
    for (let i = 0; i < array.length; i++) {
      s += array[i];
    }
    return s;
  }

  diffArray(array) {
    let d = 0;
    for (let i = 0; i < array.length; i++) {
      d -= array[i];
    }
    return d;
  }

  prodArray(array) {
    let prod = 1.0;
    for (let i = 0; i < array.length; i++) {
      p *= array[i];
    }
    return prod;
  }

  printArray(array) {
    for (let i = 0; i < array.length; i++) {
      console.log(array[i] + ' ');
    }
  }

  swapFunction(array, a, b) {
    let c = array[a];
    array[a] = array[b];
    array[b] = c;

    // array[b] = array[a] + (array[a] = array[b]) - array[b];
    // array[a] = array.splice(b, 1, array[a])[0];
    // [array[a], array[b]] = [array[b], array[a]];
  }

  powerFunction(x, y) {
    let result = 1.0;
    let power = y;
    if (y < 0) {
      power = -power;
      x = 1.0 / x;
    }
    while (power != 0) {
      if ((power & 1) != 0) {
        result *= x;
      }
      x *= x;
      power >>>= 1;
    }
    return result;
  }

  isPalindromeNumber(x) {
    if (x < 0) {
      return false;
    }

    let numDigits = parseInt(Math.floor(Math.log10(x))) + 1;
    let msdMask = parseInt(Math.pow(10, numDigits - 1));
    for (let i = 0; i < (numDigits / 2); ++i) {
      if ((x / msdMask) != (x % 10)) {
        return false;
      }
      x %= msdMask; // remove the most significant digit of x
      x /= 10; // remove the least significant digit of x
      msdMask /= 100;
    }
    return true;
  }

  reverseDigits(x) {
    let result = 0;
    let xRemaining = Math.abs(x);
    while (xRemaining != 0) {
      let getLastDigit = xRemaining % 10;
      result = (result * 10) + getLastDigit;
      xRemaining /= 10;
    }
    return x < 0 ? -result:result;
  }

  rearrangeArray(array) {
    let array2 = [];
    for (let i = 1; i < array.length; i++) {
      if (((i % 2 == 0) && (array[i - 1] < array[i]))
          || ((i % 2 != 0) && (array[i - 1] > array[i]))) {
             //let q = array[i - 1];
             //array[i - 1] = array[i];
             //array[i] = q;
             this.swapFunction(array, array[i - 1], array[i]);
          }
    }
  }

  evenOdd(array) {
    let nextEven = 0;
    let nextOdd = array.length;
    while (nextEven < nextOdd) {
      if (array[nextEven] % 2 == 0) {
        nextEven += 1;
      } else {
        let temp = array[nextEven];
        array[nextEven] = array[nextOdd];
        array[nextOdd--] = temp;
      }
    }
  }

  dutchFlagPartition(array, pivotIndex) {
    let pivot = array[pivotIndex];
    let smaller = 0, equal = 0, larger = array.length;

    while (equal < larger) {
      if (array[equal] < pivot) {
        this.swapFunction(array, smaller++, equal++);
      } else if (array[equal] == pivot) {
        ++equal;
      } else {
        this.swapFunction(array, equal, --larger);
      }
    }
  }

  removeDuplicates(array) {
    let writeIndex = 1;
    for (let i = 1; i < array.length; ++i) {
      if (array[writeIndex - 1] != array[i]) {
        array[writeIndex++] = array[i];
      }
    }
  }

  reverseArray(array) {
    let start = 0, last = array.length - 1;
    for (let i = start; i <= last / 2; i++) {
      let temp = array[i];
      array[i] = array[last - i + start];
      array[last - i + start] = temp;
    }
  }

  reverseArray2(array) {
    let start = 0, end = array.length;
    while (start < end) {
      let temp = array[start];
      array[start] = array[end];
      array[end] = temp;
      start += 1;
      end -= 1;
    }
  }

  applyPermutation(perm, array) {
    for (let i = 0; i < array.length; ++i) {
      let next = i;
      while (perm[next] >= 0) {
        let aux = i;
        i = perm[next];
        perm[next] = aux;

        let temp = perm[next];
        perm[next] = perm[next] - perm.length;
        next = temp;
      }
    }

    for (let i = 0; i < perm.length; i++) {
      perm[i] = perm[i] + perm.length;
    }
  }

  rotateLeft(array) {
    let getFirstEl = array[0];
    for (let i = 0; i < array.length - 1; i++) {
      array[i] = array[i + 1];
    }
    array[array.length - 1] = getFirstEl;
  }

  rotateLeftArray(array, pos) {
    for (let i = 0; i < pos; i++) {
      this.rotateLeft(array);
    }
  }

  rotateRight(array) {
    let getLastEl = array[array.length - 1];
    for (let i = array.length - 1; i > 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = getLastEl;
  }

  rotateRightArray(array, pos) {
    for (let i = 0; i < pos; i++) {
      this.rotateRight(array);
    }
  }

  addBeginning(array, firstEl) {
    for (let i = array.length; i > 0; i--) {
      array[i] = array[i - 1];
    }
    array[0] = firstEl;
  }

  removeBeginning(array) {
    for (let i = 1; i < array.length; i++) {
      array[i - 1] = array[i];
    }
    array.length -= 1;
  }

  addEnd(array, lastEl) {
    array[array.length] = lastEl;
  }

  removeEnd(array) {
    for (let i = array.length - 2; i > 0; i--) {
      array[i] = array[i - 1];
    }
    array.length -= 1;
  }

  addOnPosition(array, pos, val) {
    array.length += 1;
    for (let i = array.length - 1; i >= pos; i--) {
      array[i] = array[i - 1];
    }
    array[pos - 1] = val;
  }

  removeOnPosition(array, pos) {
    for (let i = pos - 1; i < array.length - 1; i++) {
      array[i] = array[i + 1];
    }
    array.length -= 1;
  }

  countOccurrences(array, elem) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] == elem) {
        count += 1;
      }
    }
    return count;
  }

  linearSearch(array, elem) {
    let found = false;
    for (let i = 0; i < array.length; i++) {
      if (array[i] == elem) {
        found = true;
      }
    }
    return found;
  }

  binarySearchRecursive(array, start, end, elem) {
    if (start > end) {
      return false;
    }

    let middle = Math.floor((start + end) / 2.0);

    if (array[middle] == elem) {
      return middle;
    }

    if (array[middle] > elem) {
      return this.binarySearchRecursive(array, start, middle - 1, elem);
    } else {
      return this.binarySearchRecursive(array, middle + 1, end, elem);
    }
  }

  binarySearchIterative(array, start, end, elem) {
    while (start <= end) {
      let middle = Math.floor((start + end) / 2.0);

      if (array[middle] == elem) {
        return true;
      } else if (array[middle] < elem) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    return false;
  }

  bubbleSort(array) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (array[j] > array[j + 1]) {
          let tmp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = tmp;
        }
      }
    }
  }

  selectionSort(array) {
    for (let i = 0; i < array.length; i++) {
      let min = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[min]) {
          min = j;
        }
      }
      if (min != i) {
        let tmp = array[i];
        array[i] = array[min];
        array[min] = tmp;
      }
    }
  }

  insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
      let tmp = array[i];
      let j = i - 1;
      while (j >= 0 && array[j] > tmp) {
        array[j + 1] = array[j];
        j = j - 1;
      }
      array[j + 1] = tmp;
    }
  }
}

module.exports = ArrayUtils;
