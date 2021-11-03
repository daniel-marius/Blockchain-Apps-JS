const express = require('express');
const port = 4000;
const app = express();

const Wallet = require('./wallet').Wallet;
const wallet = new Wallet();

app.get('/', (req, res) => {
  res.send(wallet.generatePassword());
});

app.listen(port, () => {
  console.log(`Server started on port ${ port }`);
});
