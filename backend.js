const Web3 = require("web3");
const Contract = require("./build/Contract.abi.json");

let getAvailable = require("./backend-methods").getAvailable;
let getTaken = require("./backend-methods").getTaken;
let ids = require("./backend-methods").ids;
let taken = getTaken();
let available = getAvailable();

const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;
const FROMADDRESS = process.env.FROMADDRESS;

const fs = require("fs");
const { makeAvailableList } = require("./backend-methods");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://:${APISECRET}@mainnet.infura.io/v3/${APIKEY}`
  )
);
let contractABI = JSON.parse(Contract.result);
let MyContract = new web3.eth.Contract(
  contractABI,
  "0x25ed58c027921e14d86380ea2646e3a1b5c55a8b",
  { from: FROMADDRESS }
);

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

async function getOwner(id) {
  return new Promise((resolve, reject) => {
    MyContract.methods
      .ownerOf(id)
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

let list = makeAvailableList();
list.forEach((value) => {
  getOwner(value)
    .then((res) => {
      console.log(value, "is now taken by", res);
      taken.push(value);
    })
    .catch((err) => {
      console.error(`${value} ${err.message}`);
    });
});

setTimeout(() => {
  const filteredTaken = taken.filter(unique);
  const data = JSON.stringify({ taken: filteredTaken });
  fs.writeFile("./build/taken2.json", data, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully to ./build/taken.json`);
      let updatedTaken = getTaken();
      console.log("taken count", updatedTaken.length);
      console.log("tokens left", 7787 - updatedTaken.length);
    }
  });
}, 10000);
