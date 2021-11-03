class QueueArray {

  constructor(limit) {
    this.queue = [];
    this.limit = limit;
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  isEmpty() {
    return this.size <= 0;
  }

  enQueue(item) {
    if (this.size >= this.limit) {
      this.resizeQueue();
    }

    this.queue.push(item);

    if (this.front == null) {
      this.front = this.rear = 0;
    } else {
      this.rear = this.size;
    }

    this.size += 1;
  }

  deQueue() {
    if (this.size <= 0) {
      return 0;
    } else {
      this.queue.shift();
      this.size -= 1;
      if (this.size == 0) {
        this.front = this.rear = null;
      } else {
        this.rear = this.size - 1;
      }
    }
  }

  queueRear() {
    if (this.rear == null) {
      console.log("Queue is Empty!");
    }
    return this.queue[this.rear];
  }

  queueFront() {
    if (this.front == null) {
      console.log("Queue is Empty!");
    }
    return this.queue[this.front];
  }

  getSize() {
    return this.size;
  }

  resizeQueue() {
    let newQueue = Array.from(this.queue);
    this.limit = 2 * this.limit;
    this.queue = newQueue;
  }

  displayQueue() {
    if (this.front < 0) {
      console.log("Queue is Empty!");
    }

    if (this.rear >= this.front) {
      for (let i = this.front; i <= this.rear; i++) {
        console.log(this.queue[i]);
      }
    } else {
      for (let i = this.front; i <= this.size; i++) {
        console.log(this.queue[i]);
      }

      for (let i = 0; i <= this.rear; i++) {
        console.log(this.queue[i]);
      }
    }
  }
}

module.exports = QueueArray;
