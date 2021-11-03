const Iterator = require('../patterns/iterator').Iterator;

class ArrayUtils2 extends Iterator {

  constructor() {
    super();
  }

  createArray() {
    const size = 5;
    const newArray = Array.from({ length: size }).map(() => 0);
    const newArray2 = [... new Array(size)].map(() => 0);
    console.log(newArray2);
    console.log(Array(0, 2).map(() => 5));
  }

}

const obj = new ArrayUtils2();
obj.createArray();

module.exports = ArrayUtils2;
