const express = require("express");
const bodyParser = require("body-parser");

const Blockchain = require("../blockchain");
const Miner = require("./miner");
const P2PServer = require("./p2p-server");
const TransactionPool = require("../wallet/transaction-pool");
const Wallet = require("../wallet");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();
const p2pServer = new P2PServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);


app.use(bodyParser.json());

app.get("/blocks", (req, res, next) => {
  return res.json(bc.chain);
});

app.get("/transaction", (req, res) => {
  return res.json(tp.transactions);
});

app.get("/public-key", (req, res) => {
  return res.json({ publicKey: wallet.publicKey });
});

app.post("/mine", (req, res) => {
  const block = bc.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();
  return res.redirect("blocks");
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  p2pServer.broadcastTransaction(transaction);
  return res.redirect("/transaction");
});

app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  console.log(`new Block added: ${block.toString()}`);
  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
